define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-forgot-password"
	],
	function($, Cookie, App, Utils, Marionette, Template){
	"use strict";

	var ViewForgotPassword = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #submit"	: "submit",
			"click #return"	: "returnToLogin",
			"click #help-icon"	: "showHelp"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Forgot Password view initialized...");
		},

		submit : function(){
			$("input").removeClass("error");

			var vldtRegister = vldt.validate({
				"#emailaddress"	: "email",
			});

			if(!vldtRegister){

				var errors = vldt.getErrors();
				console.log(vldt.getErrors());

				for(var key in errors){
					if(errors[key] === false){
						$(key).addClass("error");
						switch(key){
							case "#emailaddress":
								Utils.ShowToast({message : "Invalid email address"});
							break;
						}
					}
				}

				return false;
			}else{
				var email = $("#emailaddress").val();
				Utils.ShowToast({message : "An email is sent with password reset instructions"});
			}
		},

		returnToLogin : function(){
			App.router.navigate("login", true);
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

	return ViewForgotPassword;
});