define([
		"jquery",
        "app",
        "utils",
		"marionette",
		"scripts/layouts/layout-portal",
		"scripts/layouts/layout-app",
		"scripts/views/view-login",
		"scripts/views/view-signup",
		"scripts/views/view-find-business",
		"scripts/views/view-add-business",
		"scripts/views/view-account-verification",
		"scripts/views/view-nav",
		"scripts/views/view-jobs",
		"scripts/views/view-candidates",
		"scripts/views/view-profile",
		"scripts/views/view-network",
		"scripts/views/view-messages",
		"scripts/views/view-settings"
	],
	function($, App, Utils, Marionette, LayoutPortal, LayoutApp, ViewLogin, ViewSignup, ViewFindBusiness, ViewAddBusiness, ViewAccountVerification, ViewNav, ViewJobs, ViewCandidates, ViewProfile, ViewNetwork, ViewMessages, ViewSettings){
		"use strict";

		var AppController = Marionette.Controller.extend({

			session : function(){
				console.log("App routed to session...");
				App.router.navigate("login", true);
			},

			login : function(){
				var layout = new LayoutPortal();
				App.body.show(layout);

				var view = new ViewLogin();
				layout.body.show(view);
			},

			signup : function(){
				var layout = new LayoutPortal();
				App.body.show(layout);

				var view = new ViewSignup();
				layout.body.show(view);
			},

			findBusiness : function(){
				var layout = new LayoutPortal();
				App.body.show(layout);

				var view = new ViewFindBusiness();
				layout.body.show(view);
			},

			addBusiness : function(){
				var layout = new LayoutPortal();
				App.body.show(layout);

				var view = new ViewAddBusiness();
				layout.body.show(view);
			},

			accountVerification : function(){
				var layout = new LayoutPortal();
				App.body.show(layout);

				var view = new ViewAccountVerification();
				layout.body.show(view);
			},

			jobs : function(){
				var layout = new LayoutApp();
				App.body.show(layout);

				var nav = new ViewNav({tab : "jobs"});
				var view = new ViewJobs();

				layout.nav.show(nav);
				layout.body.show(view);
			},

			candidates : function(){
				var layout = new LayoutApp();
				App.body.show(layout);

				var nav = new ViewNav({tab : "candidates"});
				var view = new ViewCandidates();

				layout.nav.show(nav);
				layout.body.show(view);
			},

			candidatesByJob : function(){
				var layout = new LayoutApp();
				App.body.show(layout);

				var nav = new ViewNav({tab : "jobs"});
				var view = new ViewCandidates({mode : "child"});

				layout.nav.show(nav);
				layout.body.show(view);
			},

			profile : function(id, selection){
				var layout = new LayoutApp();
				App.body.show(layout);

				var nav = new ViewNav({tab : selection});
				var view = new ViewProfile();

				layout.nav.show(nav);
				layout.body.show(view);
			},

			network : function(){
				var layout = new LayoutApp();
				App.body.show(layout);

				var nav = new ViewNav({tab : "network"});
				var view = new ViewNetwork();

				layout.nav.show(nav);
				layout.body.show(view);
			},

			messages : function(){
				var layout = new LayoutApp();
				App.body.show(layout);

				var nav = new ViewNav();
				var view = new ViewMessages();

				layout.nav.show(nav);
				layout.body.show(view);
			},

			settings : function(){
				var layout = new LayoutApp();
				App.body.show(layout);

				var nav = new ViewNav();
				var view = new ViewSettings();

				layout.nav.show(nav);
				layout.body.show(view);
			},

			logout : function(){
				App.router.navigate("login", true);
			}
			
		});

		return AppController;
	}
);