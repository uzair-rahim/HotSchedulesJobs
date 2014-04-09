define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-candidates"
	],
	function($, Cookie, App, Utils, Marionette, Template){
	"use strict";

	var ViewCandidates = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #profile" : "profile",
			"click #back"	 : "back"
		},

		initialize : function(options){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Candidates view initialized...");
		},

		onShow : function(){
			if(typeof this.options.mode !== "undefined"){
				$("#breadcrumb").prepend("<li id='back'>Job</li>");
			}
		},

		back : function(){
			window.history.back();
		},

		profile : function(){
			App.router.navigate("profile/candidates/candidates", true);
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewCandidates;
});