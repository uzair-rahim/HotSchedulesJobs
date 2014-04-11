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
		"scripts/views/view-settings",
		"scripts/models/model-jobtypes",
		"scripts/collections/collection-jobs"
	],
	function($, App, Utils, Marionette, LayoutPortal, LayoutApp, ViewLogin, ViewSignup, ViewFindBusiness, ViewAddBusiness, ViewAccountVerification, ViewNav, ViewJobs, ViewCandidates, ViewProfile, ViewNetwork, ViewMessages, ViewSettings, ModelJobTypes, CollectionJobs){
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
				App.clearTrail();
				App.pushTrail("jobs");

				var layout = new LayoutApp();
				App.body.show(layout);

				var nav = new ViewNav({tab : "jobs"});

				var jobtypes = new ModelJobTypes();
				var jobs = new CollectionJobs();
				var models = new Object();

				$.when(
					jobtypes.fetch({
						headers : {
							"token" : Utils.GetUserSession().brushfireToken
						},
						success : function(jobtypesResponse){
							console.log("Job Types fetched successfully...");
							models.jobtypes = jobtypesResponse.attributes;
						},
						error : function(){
							console.log("Error fetching Job Types...");
						}
					}),
					jobs.fetch({
						headers : {
							"token" : Utils.GetUserSession().brushfireToken
						},
						success : function(collection, jobsResponse){
							console.log("Jobs fetched successfully...");
							models.jobs = jobsResponse;
						},
						error : function(){
							console.log("Error fetching Jobs...");
						}
					})

				).then(function(){
					var view = new ViewJobs({model : models});
						layout.nav.show(nav);
						layout.body.show(view);
				});

				
			},

			candidates : function(){
				App.clearTrail();
				App.pushTrail("candidates");

				var layout = new LayoutApp();
				App.body.show(layout);

				var nav = new ViewNav({tab : "candidates"});

				var jobtypes = new ModelJobTypes();
				var jobs = new CollectionJobs();
				var models = new Object();

				$.when(
					jobtypes.fetch({
						headers : {
							"token" : Utils.GetUserSession().brushfireToken
						},
						success : function(jobtypesResponse){
							console.log("Job Types fetched successfully...");
							models.jobtypes = jobtypesResponse.attributes;
						},
						error : function(){
							console.log("Error fetching Job Types...");
						}
					}),
					jobs.fetch({
						headers : {
							"token" : Utils.GetUserSession().brushfireToken
						},
						success : function(collection, jobsResponse){
							console.log("Jobs fetched successfully...");
							models.jobs = jobsResponse;
						},
						error : function(){
							console.log("Error fetching Jobs...");
						}
					})

				).then(function(){
					var view = new ViewJobs({model : models});
					var view = new ViewCandidates({model : models});
						layout.nav.show(nav);
						layout.body.show(view);
				});

			},

			candidatesByJob : function(){
				App.pushTrail("candidates");

				var layout = new LayoutApp();
				App.body.show(layout);

				var nav = new ViewNav({tab : "jobs"});
				var view = new ViewCandidates({mode : "child"});

				layout.nav.show(nav);
				layout.body.show(view);
			},

			network : function(){
				App.clearTrail();
				App.pushTrail("network");

				var layout = new LayoutApp();
				App.body.show(layout);

				var nav = new ViewNav({tab : "network"});
				var view = new ViewNetwork();

				layout.nav.show(nav);
				layout.body.show(view);
			},

			messages : function(){
				App.clearTrail();
				App.pushTrail("messages");

				var layout = new LayoutApp();
				App.body.show(layout);

				var nav = new ViewNav();
				var view = new ViewMessages();

				layout.nav.show(nav);
				layout.body.show(view);
			},

			settings : function(){
				App.clearTrail();
				App.pushTrail("settings");

				var layout = new LayoutApp();
				App.body.show(layout);

				var nav = new ViewNav();
				var view = new ViewSettings();

				layout.nav.show(nav);
				layout.body.show(view);
			},

			profile : function(id, selection){

				App.pushTrail("profile");

				var layout = new LayoutApp();
				App.body.show(layout);

				var nav = new ViewNav({tab : selection});
				var view = new ViewProfile();

				layout.nav.show(nav);
				layout.body.show(view);
			},

			logout : function(){
				Utils.DeleteUserSession();
				App.router.navigate("login", true);
			}
			
		});

		return AppController;
	}
);