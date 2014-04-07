define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-login",
		"scripts/models/model-authenticate"
	],
	function($, Cookie, App, Utils, Marionette, Template, ModelAuthenticate){
	"use strict";

	var ViewLogin = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #login"		: "login",
			"click #signup"		: "signup"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Login view initialized...");
		},

		login : function(){
			console.log("Login...");

			var emailField = $("#emailaddress").val();
			var passwordField = $("#password").val();

			/*
			var auth = new ModelAuthenticate({email : emailField, password : passwordField});
				auth.fetch({
					success : function(){
						console.log("User successfully authenticated...");
					},

					error : function(){
						console.log("Error authenticating user...");
					}
				});
			*/
			
			App.router.navigate("jobs", true);
		},

		signup : function(){
			console.log("Signup...");
			App.router.navigate("signup", true);
		},
		
		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewLogin;
});