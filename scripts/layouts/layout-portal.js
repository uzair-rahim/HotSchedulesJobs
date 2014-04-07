define([
		"jquery",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-layout-portal"
	],
	function($, App, Utils, Marionette, Template){
		"use strict";

		var LayoutPortal = Marionette.Layout.extend({
			tagName : "div",
			className : "portal",
			template : Template,
			regions : {
				head : "#portal-head",
				body : "#portal-body"
			},
			
			events : {
				
			},

			initialize : function(){
				_.bindAll.apply(_, [this].concat(_.functions(this)));
				console.log("Portal layout initialized...");
			},
			
			serializeData : function(){
				var jsonObject = new Object();
					jsonObject.language = App.Language;
				return jsonObject;
			}
		});

		return LayoutPortal;
	}
);