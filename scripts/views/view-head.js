define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-head"
	],
	function($, Cookie, App, Utils, Marionette, Template){
	"use strict";

	var ViewHead = Marionette.ItemView.extend({
		tagName : "div",
		className : "heading",
		template: Template,
		events : {
			
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Head view initialized...");
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewHead;
});