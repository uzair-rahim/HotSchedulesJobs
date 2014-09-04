define([
		"jquery",
		"jqueryui",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-login",
		"scripts/models/model-authenticate",
		"scripts/models/model-user",
		"scripts/models/model-network"
	],
	function($, jqueryUI, Cookie, App, Utils, Marionette, Template, ModelAuthenticate, ModelUser, ModelNetwork){
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

			if(typeof Utils.GetRememberedEmail() !== "undefined"){
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

			var emailField = $("#emailaddress").val();
			var passwordField = $("#password").val();
			var checked = $("#remember-me-check").prop("checked");

			var that = this;
			var authObject = {emailaddress : emailField, password : passwordField};
			var auth = new ModelAuthenticate();
				auth.save(authObject, {
					success : function(response){
						console.log("User successfully authenticated...");

						var user = new Object();
							user.guid = response.attributes.guid;
							user.firstname = response.attributes.firstname;
							user.lastname = response.attributes.lastname;
							user.email = response.attributes.email;
							user.verified = response.attributes.verified;
							user.employerIds = response.attributes.employerIds;
							user.roles = response.attributes.roles;
						
							Utils.CreateUserSession(user);
							Utils.RememberUserEmail(checked, user.email);

						var adminEmployers = response.attributes.adminEmployers;
							Utils.SetAdminEmployers(adminEmployers);	
							Utils.SetSelectedEmployer(0);

						var support = Utils.IsSupportUser(user.roles);	

							var userModel = new ModelUser({guid : user.guid});
							userModel.getNetworkUsers(function(data){
								var connections = [];

								$.each(data, function(){
									connections.push(this.guid);
								});

								var networkModel = new ModelNetwork();
									networkModel.getReceivedRequests(user.guid, function(data){

										$.each(data, function(){
											connections.push(this.fromUserGuid);
										});

										networkModel.getSentRequests(user.guid, function(data){
											
											$.each(data, function(){
												connections.push(this.toUserGuid);
											});

											Utils.SetUserConnectionsList(connections);
											that.routeUser(support,user);

										});

									});
							});
					},

					error : function(){
						console.log("Error authenticating user...");
						$(".form-container").effect("shake");
						Utils.ShowToast({message : "Invalid email address or password"});
					}
				});
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
				jsonObject.userEmail = Utils.GetRememberedEmail();
			return jsonObject;
		}
		
	});

	return ViewLogin;
});
