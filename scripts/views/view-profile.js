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
			"click #breadcrumb li" : "back"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Profile view initialized...");
		},

		back : function(event){
			var index = $(event.target).index();
			var goBack = (index+1) - App.getTrailLength();

			for(var i = 0; i <= goBack*(-1); i++){
				App.popTrail();
			}

			if(goBack !== 0){
				window.history.go(goBack);
			}
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
				jsonObject.breadcrumb = App.getTrail();
			return jsonObject;
		}
		
	});

	return ViewProfile;
});