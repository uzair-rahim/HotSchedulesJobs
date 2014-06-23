define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-support-nav"
	],
	function($, Cookie, App, Utils, Marionette, Template){
	"use strict";

	var ViewSupportNav = Marionette.ItemView.extend({
		tagName : "div",
		className : "navigation",
		template: Template,
		events : {
			"click #settings"	: "settings",
			"click #logout"		: "logout"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Support Nav view initialized...");
		},

		settings : function(){
			var settings = $("#settings-flyout");
			var isVisible = $(settings).css("display") == "block"
			if(isVisible){
				$(settings).hide();
			}else{
				$(settings).show();
			}
		},

		logout : function(){
			App.router.navigate("logout", true);
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewSupportNav;
});