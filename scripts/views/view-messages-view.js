define([
		"jquery",
		"jquerycookie",
		"analytics",
		"app",
		"utils",
		"marionette",
		"scripts/models/model-chat",
		"hbs!templates/template-view-messages-view"
	],
	function($, Cookie, Analytics, App, Utils, Marionette, ModelChat, Template){
	"use strict";

	var ViewMessageView = Marionette.ItemView.extend({
		tagName : "div",
		className : "message-view-container",
		template: Template,
		events : {
			
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Message view view initialized...");
		},
		
		serializeData : function(){
			var jsonObject = new Object();
			jsonObject.haveChats = this.options.model.haveChats;
			jsonObject.chat = this.options.model.chat;
			return jsonObject;
		}
		
	});

	return ViewMessageView;
});


