define([
		"jquery",
		"jqueryui",
		"jquerycookie",
		"analytics",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-login",
		"scripts/models/model-authenticate",
		"scripts/models/model-user",
		"scripts/models/model-network"
	],
	function($, jqueryUI, Cookie, Analytics, App, Utils, Marionette, Template, Authenticate, ModelUser, ModelNetwork){
	"use strict";

	var ViewLogin = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #login"			 : "login",
			"click #signup"			 : "signup",
			"click #forgot-password" : "forgotPassword",
			"click #help-icon"		 : "showHelp"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Login view initialized...");
		},

		onShow : function(){
			ga('create', 'UA-52257201-1', 'hotschedulespost.com');
      		ga('send', 'pageview', '/view-login');

      		if(App.session.isRememberMe()){
				$("#emailaddress").val(App.session.getEmail());
				$("#remember-me-check").prop("checked", true);
			}

			$("#emailaddress, #password").keyup(function(event){
				if(event.keyCode == 13){
					$("#login").click();
				}
			});
		},

		login : function(){
			console.log("Login...");

			var formEmail = $("#emailaddress").val();
			var formPassword = $("#password").val();

			var credentials = {
				emailaddress : formEmail,
				password 	 : formPassword
			}

			var options = {
				success : function(response){
					var user = new Object();
						user = auth.getUser();
						user.expired = false;
						user.remember = $("#remember-me-check").prop("checked");
						
					App.session.set(user);

					var userModel = new ModelUser();
					userModel.getUserEventByType(user.guid,0,function(response){
						App.session.set("trainingCompleted", response.completed !== null);
						App.session.set("trainingEventGUID", response.guid);

						var networkModel = new ModelNetwork();
						networkModel.getConnections(user.guid, function(data){
							var connections = [];

							$.each(data, function(){
								var connection = new Object();
								connection.guid = this.guid;
								connection.fromUserGUID = this.fromUserGuid;
								connection.toUserGUID = this.toUserGuid;
								connection.state = "connected";
								connections.push(connection);
							});

									
							networkModel.getReceivedRequests(user.guid, function(data){
								$.each(data, function(){
									var connection = new Object();
									connection.guid = this.guid;
									connection.fromUserGUID = this.fromUserGuid;
									connection.toUserGUID = this.toUserGuid;
									connection.state = "received";
									connections.push(connection);
								});

								networkModel.getSentRequests(user.guid, function(data){
									$.each(data, function(){
										var connection = new Object();
										connection.guid = this.guid;
										connection.fromUserGUID = this.fromUserGuid;
										connection.toUserGUID = this.toUserGuid;
										connection.state = "sent";
										connections.push(connection);
									});

									Utils.SetUserConnectionsList(connections);

								});

							});

						});

					});

					App.router.controller.redirectOnLogin();

				},
				error : function(model, errors){
					if(typeof(errors.responseJSON) !== "undefined"){
						var error = errors.responseJSON;
						Utils.ShowToast({message : error.errorMsg});
					}
				}
			}

			var auth = new Authenticate();
			auth.set(credentials, {validate:true});
			
			if(auth.validationError){
				Utils.ShowToast({message : auth.validationError[0].message});
			}else{
				auth.save(credentials, options);
			}

		},

		signup : function(){
			console.log("Signup...");
			App.router.navigate("signup", true);
		},

		forgotPassword : function(){
			console.log("Forgot Password...");
			App.router.navigate("forgotPassword", true);
		},

		showHelp : function(){
			Utils.ShowHelp();
		},

		routeUser : function(support,user){
			if(support){
				//If the user is a support user go to support page
				App.router.navigate("support", true);
			}else{
				if(user.employerIds.length  === 1 ){
					//If the user is an admin of only one employer go directly to the jobs page
					App.router.navigate("jobs", true);
				}else if(user.employerIds.length > 1){
					//If the user is an admin of more than one employer go to select employer page before going to the jobs page
					App.router.navigate("selectEmployer", true);
				}else{
					if(user.verified){
						//If the user is not an admin already but have verified the email go to find business page
						App.router.navigate("findBusiness", true);
					}else{
						//if the user is not an admin and has not verified the email go to account verification page
						App.router.navigate("accountVerification", true);
					}
				}
			}
		},
		
		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
				jsonObject.userEmail = App.session.getEmail();
			return jsonObject;
		}
		
	});

	return ViewLogin;
});
