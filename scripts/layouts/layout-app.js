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
				nav  : "#app-nav",
				body : "#app-body"
			},
			
			events : {
				
			},

			initialize : function(){
				_.bindAll.apply(_, [this].concat(_.functions(this)));
				console.log("App layout initialized...");
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