define([
		"jquery",
		"jquerycookie",
		"hbs/underscore",
		"modernizr",
		"utils",
		"backbone",
		"wreqr",
		"marionette",
		"hbs/handlebars",
		"scripts/models/model-language",
		"scripts/models/model-session",
		"scripts/layouts/layout-app",
		"scripts/views/view-menu"
	],
	function($, Cookie, _, Modernizr, Utils, Backbone, Wreqr, Marionette, Handlebars, ModelLanguage, Session, Layout, Menu){
		"use strict";

		var App = new Marionette.Application();
		
		App.Language = new Object();
		App.Breadcrumb = new Array();

		// Session
		App.session = new Session();
		App.session.getUserSession();

		// Layout
		App.layout = new Layout({app : App});

		// Menu
		App.menu = new Menu({app : App});

		// Add regions to the App
		App.addRegions({
			body : "#brushfire"
		});
		
		// Before the App is initialized	
		App.on("initialize:before", function(){
			console.log("Brushfire before initialized...");
			App.getLanguagePack();
			Utils.InitCustomSelect();
			Utils.InitMaxTextAreaLength();
			Utils.InitQuickMessageView();
		});

		// Add initializer to the App
		App.addInitializer(function(options){
			console.log("Brushfire add initializer...");
		});

		// After the App is initialized
		App.on("initialize:after", function(){
			console.log("Brushfire initialized...");
			App.body.show(App.layout);
			
			if(App.session.get("logged")){
				App.appendMenu();
			}

			this.listenTo(App.session, "loggedChanged", App.appendMenu);
		});

		// Append Menu
		App.appendMenu = function(){
			if(App.session.get("logged")){
				App.layout.menu.show(App.menu);
			}
		}

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
		$(document).ajaxError(function(event, request, settings){
			console.log("ajaxError...");
			switch(request.status){
				case 401 : 
					Utils.ShowToast({message : "Invalid Credentials"});
					App.router.navigate("logout", true);
				break;
				case 403 : 
					Utils.ShowToast({message : "Access Denied"});
					App.session.set("expired", true);
					App.router.navigate("logout", true);
				break;
				case 500 :
					Utils.ShowToast({message : "Internal Server Error"});
					var response = request.responseJSON;
					if(response.errorCode === 26){
						Utils.ShowToast({ type: "error", message : "User is not verified"});
					}else{
						App.router.navigate("logout", true);	
					}
					
				break;	
			}
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

		// When navigating away from the app
		$(window).on('beforeunload', function(){
      		if(!App.session.isVerified()){
      			App.session.removeUserSession();	
      		}
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

		// Global Click Handler
		$(document).on("click", function(event){
			var element = $(event.target);

			// Hide the Employer Switch Drop Down when user clicks anywhere in the document
			var employerName = element.hasClass("employer-name");
			
			if(App.menu.el.innerHTML !== "" && !employerName){
				var employers = App.session.attributes.employers;
				var employersList = $(document).find(".employers-list");
				if(employers !== null && employers.length > 1 && employersList.hasClass("show")){
					App.menu.showSwitchEmployer();
				}
			}
			
		});

		return App;
	}
);