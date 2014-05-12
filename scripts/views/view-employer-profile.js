define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-employer-profile"
	],
	function($, Cookie, App, Utils, Marionette, Template){
	"use strict";

	var ViewEmployerProfile = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #logout" : "logout"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Employer profile view initialized...");
		},

		logout : function(){
			App.router.navigate("logout", true);
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.employerProfile = this.model;
				jsonObject.language = App.Language;
				jsonObject.breadcrumb = App.getTrail();
			return jsonObject;
		}
		
	});

	return ViewEmployerProfile;
});