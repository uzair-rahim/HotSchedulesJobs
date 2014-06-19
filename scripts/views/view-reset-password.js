define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-reset-password"
	],
	function($, Cookie, App, Utils, Marionette, Template){
	"use strict";

	var ViewResetPassword = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #submit"		: "submit",
			"click #help-icon"	: "showHelp",
			"click #return"		: "returnToLogin"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Reset Password view initialized...");
		},

		onShow : function(){
			$("#confirmpassword").keyup(function(event){
				if(event.keyCode == 13){
					$("#submit").click();
				}
			});
		},

		submit : function(){
			
		},

		returnToLogin : function(){
			window.location.href = "index.jsp";
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

	return ViewResetPassword;
});