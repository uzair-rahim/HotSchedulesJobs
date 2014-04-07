define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-account-verification"
	],
	function($, Cookie, App, Utils, Marionette, Template){
	"use strict";

	var ViewAccountVerification = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #continue"	: "continue"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Account Verification view initialized...");
		},

		continue : function(){
			console.log("Continue...");
			App.router.navigate("login", true);
		},
		
		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewAccountVerification;
});