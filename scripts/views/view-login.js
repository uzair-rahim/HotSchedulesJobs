define([
		"jquery",
		"jqueryui",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-login",
		"scripts/models/model-authenticate"
	],
	function($, jqueryUI, Cookie, App, Utils, Marionette, Template, ModelAuthenticate){
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

			var auth = new ModelAuthenticate({email : emailField, password : passwordField});
				auth.fetch({
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
							var support = Utils.IsSupportUser(user.roles);

							if(support){
								App.router.navigate("support", true);
							}else{
								if(user.employerIds.length > 0){
									App.router.navigate("jobs", true);
								}else{
									if(user.verified){
										App.router.navigate("findBusiness", true);
									}else{
										App.router.navigate("accountVerification", true);
									}
								}
							}
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
		
		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewLogin;
});
