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
				head : "#app-head",
				body : "#app-body"
			},
			
			events : {
				"click #primary-action"		: "primaryAction",
				"click #secondary-action"	: "secondaryAction",
				"click #close-help"			: "closeHelp",
				"click #accept-terms"		: "acceptTerms",
				"click #decline-terms"		: "declineTerms"
			},

			initialize : function(){
				_.bindAll.apply(_, [this].concat(_.functions(this)));
				console.log("App layout initialized...");
			},

			onRender : function(){
				$.get("terms.html", function(data){
					$(".terms-and-conditions").html(data);
				});
			},

			primaryAction : function(){
				App.trigger("alertPrimaryAction");
			},

			secondaryAction : function(){
				App.trigger("alertSecondaryAction");
			},

			closeHelp : function(){
				Utils.HideHelp();
			},

			acceptTerms : function(){
				Utils.HideTermsAndConditions();
				$(document).find("#accept").prop("checked", true);
			},

			declineTerms : function(){
				Utils.HideTermsAndConditions();
				$(document).find("#accept").prop("checked", false);
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