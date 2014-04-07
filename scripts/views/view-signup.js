define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-signup"
	],
	function($, Cookie, App, Utils, Marionette, Template){
	"use strict";

	var ViewSignup = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #signup"		: "signup",
			"click #nevermind"	: "nevermind"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Signup view initialized...");
		},

		signup : function(){
			console.log("Signup...");
			App.router.navigate("findBusiness", true);
		},

		nevermind : function(){
			console.log("Nevermind...");
			App.router.navigate("login", true);
		},
		
		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewSignup;
});