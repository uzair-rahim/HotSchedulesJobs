define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-settings"
	],
	function($, Cookie, App, Utils, Marionette, Template){
	"use strict";

	var ViewSettings = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Settings view initialized...");
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
				jsonObject.breadcrumb = App.getTrail();
			return jsonObject;
		}
		
	});

	return ViewSettings;
});