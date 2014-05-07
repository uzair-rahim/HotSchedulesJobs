define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-connections"
	],
	function($, Cookie, App, Utils, Marionette, Template){
	"use strict";

	var ViewConnections = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #breadcrumb li" 	: "back"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Network view initialized...");
		},

		back : function(event){
			var index = $(event.target).index();
			var goBack = (index+1) - App.getTrailLength();

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

	return ViewConnections;
});