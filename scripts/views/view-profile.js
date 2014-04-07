define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"backbone",
		"marionette",
		"hbs!templates/template-view-profile"
	],
	function($, Cookie, App, Utils, Backbone, Marionette, Template){
	"use strict";

	var ViewProfile = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #back" : "back"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Profile view initialized...");
		},

		back : function(){
			window.history.back();
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewProfile;
});