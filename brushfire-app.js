define([
		"jquery",
		"jquerycookie",
		"underscore",
		"modernizr",
		"utils",
		"backbone",
		"wreqr",
		"marionette",
		"Handlebars",
		"scripts/models/model-language"
	],
	function($, Cookie, _, Modernizr, Utils, Backbone, Wreqr, Marionette, Handlebars, ModelLanguage){
		"use strict";

		var App = new Marionette.Application();
		
			App.Language = new Object();
			App.Breadcrumb = new Array();

		// Add regions to the App
		App.addRegions({
			body : "#brushfire"
		});
		
		// Before the App is initialized	
		App.on("initialize:before", function(){
			console.log("Brushfire before initialized...");
			App.getLanguagePack();
			Utils.InitCustomSelect();
		});

		// Add initializer to the App
		App.addInitializer(function(options){
			console.log("Brushfire add initializer...");
		});

		// After the App is initialized
		App.on("initialize:after", function(){
			console.log("Brushfire initialized...");
		});

		// On App start
		App.on("start", function(){
			console.log("Brushfire on start...");
		});

		// Start the App
		App.startApp = function(){
			if(Backbone.history){
				Backbone.history.start();
			}
		}

		// Application AJAX event handlers

		// AJAX Start
		// The method is called when the first AJAX request begins
		$(document).ajaxStart(function(){
			console.log("ajaxStart...");
			Utils.ShowLoadingAnimation();
		});

		// AJAX Stop
		// The method is called when the ALL AJAX requests have completed
		$(document).ajaxStop(function(){
			console.log("ajaxStop...");
			Utils.HideLoadingAnimation();
		});

		// AJAX Complete
		// The method is called when an AJAX request completes
		$(document).ajaxComplete(function(){
			console.log("ajaxComplete...");
		});

		// AJAX Error
		// The method is called when the first AJAX requests complete with an error
		$(document).ajaxError(function(){
			console.log("ajaxError...");
		});

		// AJAX Send
		// The method is called before an AJAX request is sent
		$(document).ajaxSend(function(){
			console.log("ajaxSend...");
		});

		// AJAX Success
		// The method is called after an AJAX request completes successfully
		$(document).ajaxSuccess(function(){
			console.log("ajaxSuccess...");
		});

		// Load language pack
		App.getLanguagePack = function(){
			console.log("Load language pack...");

			var ln = navigator.language;
			var model = new ModelLanguage({language : ln});
				model.fetch({
					success : function(response){
						console.log("Language pack successfully loaded...");
						App.Language = response.attributes.items;
						App.startApp();
					},

					error : function(){
						console.log("Error loading language pack...");
						Utils.ShowToast({ message : "Error loading language pack"});
					}

				});
		}

		// Get Trail length
		App.getTrail = function(){
			return App.Breadcrumb;
		}

		// Push trail to Breadcrumb
		App.pushTrail = function(trail){
			App.Breadcrumb.push(trail);
		}

		// Pop trail from Breadcrumb
		App.popTrail = function(){
			App.Breadcrumb.pop();
		}

		// Clear trail
		App.clearTrail = function(){
			App.Breadcrumb.length = 0;
		}

		// Get Trail length
		App.getTrailLength = function(){
			return App.Breadcrumb.length;
		}

		return App;
	}
);