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
			"click #login"	: "login",
			"click #signup"	: "signup"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Login view initialized...");
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
							user.brushfireToken = response.attributes.brushfireToken;

							Utils.CreateUserSession(user);
							App.router.navigate("jobs", true);
					},

					error : function(){
						console.log("Error authenticating user...");
						$(".login-form-container").effect("shake");
						$("#toast").text("Invalid email address or password please try again").addClass("show");
					}
				});
		},

		signup : function(){
			console.log("Signup...");
			Utils.ShowToast({portal : true, message : "Something went seriously wrong..."});
			//App.router.navigate("signup", true);
		},
		
		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewLogin;
});