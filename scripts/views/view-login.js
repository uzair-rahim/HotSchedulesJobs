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
			"click #forgot-password" : "forgotPassword"
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
							user.employerIds = response.attributes.employerIds;

							if(response.attributes.roles.length > 0){
								user.role = response.attributes.roles[0].role;
							}else{
								user.role = "user";
							}

							Utils.CreateUserSession(user);

							if(user.role === "support"){
								App.router.navigate("support", true);
							}else{
								if(user.employerIds.length > 0){
									App.router.navigate("jobs", true);
								}else{
									App.router.navigate("addBusiness", true);
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
			Utils.ShowToast({message : "Something went seriously wrong..."});
		},
		
		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewLogin;
});
