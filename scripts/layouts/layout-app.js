define([
		"jquery",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-layout-app"
	],
	function($, App, Utils, Marionette, Template){
		"use strict";

		var LayoutApp = Marionette.Layout.extend({
			tagName : "div",
			className : "app",
			template : Template,
			regions : {
				head  : "#app-head",
				body : "#app-body"
			},
			
			events : {
				"click #primary-action" : "primaryAction",
				"click #secondary-action" : "secondaryAction"
			},

			initialize : function(){
				_.bindAll.apply(_, [this].concat(_.functions(this)));
				console.log("App layout initialized...");
			},

			primaryAction : function(){
				App.trigger("alertPrimaryAction");
			},

			secondaryAction : function(){
				App.trigger("alertSecondaryAction");
			},
			
			serializeData : function(){
				var jsonObject = new Object();
					jsonObject.language = App.Language;
				return jsonObject;
			}
		});

		return LayoutApp;
	}
);