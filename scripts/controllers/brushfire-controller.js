define([
		"jquery",
        "app",
        "utils",
		"marionette",
		"scripts/layouts/layout-app",
		"scripts/views/view-login",
		"scripts/views/view-signup",
		"scripts/views/view-find-business",
		"scripts/views/view-add-business",
		"scripts/views/view-account-verification",
		"scripts/views/view-head",
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
	function($, App, Utils, Marionette, LayoutApp, ViewLogin, ViewSignup, ViewFindBusiness, ViewAddBusiness, ViewAccountVerification, ViewHead, ViewNav, ViewJobs, ViewCandidates, ViewProfile, ViewNetwork, ViewMessages, ViewSettings, ModelJobTypes, CollectionJobs){
		"use strict";

		var AppController = Marionette.Controller.extend({

			layout : null,

			setLayout : function(){
				console.log("Setting layout...");

				if(this.layout === null){
					this.layout = new LayoutApp();
					App.body.show(this.layout);
				}

				if(Utils.CheckSession()){
					var nav = new ViewNav();
					this.layout.head.show(nav);
				}else{
					var head = new ViewHead();
					this.layout.head.show(head);
				}
			},

			setHeader : function(checkFor){
				console.log("Setting header...");

				var currentHead = this.layout.head.currentView.el.className;

				switch(checkFor){
					case "heading" :
						if(currentHead !== "heading"){
							var head = new ViewHead();
							this.layout.head.show(head);
						}
					break;
					case "navigation" :
						if(currentHead !== "navigation"){
							var nav = new ViewNav();
							this.layout.head.show(nav);
						}
					break;
				}				
			},

			setBackground : function(){
				var app = $(document).find(".app");

				if(!$(app).hasClass("background")){
					$(app).addClass("background");
				}
			},

			removeBackground : function(){
				var app = $(document).find(".app");

				if($(app).hasClass("background")){
					$(app).removeClass("background");
				}
			},

			session : function(){
				console.log("App routed to session...");

				this.setLayout();

				if(Utils.CheckSession()){
					App.router.navigate("jobs", true);	
				}else{
					App.router.navigate("login", true);	
				}
				
			},

			login : function(){
				this.setLayout();
				this.setHeader("heading");
				this.setBackground();
				
				var view = new ViewLogin();
				this.layout.body.show(view);
			},

			signup : function(){
				this.setLayout();
				this.setHeader("heading");
				this.setBackground();

				var view = new ViewSignup();
				this.layout.body.show(view);
			},

			findBusiness : function(){
				this.setLayout();
				this.setHeader("heading");
				this.setBackground();

				var view = new ViewFindBusiness();
				this.layout.body.show(view);
			},

			addBusiness : function(){
				this.setLayout();
				this.setHeader("heading");
				this.setBackground();

				var view = new ViewAddBusiness();
				this.layout.body.show(view);
			},

			accountVerification : function(){
				this.setLayout();
				this.setHeader("heading");
				this.setBackground();

				var view = new ViewAccountVerification();
				this.layout.body.show(view);
			},

			jobs : function(){

				if(Utils.CheckSession()){

					var that = this;

					App.clearTrail();
					App.pushTrail("jobs");

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
								Utils.ShowToast({portal : false, type : "error", message : "Error fetching Job Types..."});
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
								Utils.ShowToast({portal : false, type : "error", message : "Error fetching Jobs..."});
							}
						})

					).then(function(){
						that.removeBackground();
						that.setLayout();
						that.setHeader("navigation");

						var view = new ViewJobs({model : models});
							that.layout.body.show(view);
					});	
				}else{
					App.router.navigate("login", true);
				}

				
			},

			candidates : function(){

				if(Utils.CheckSession()){

					var that = this;

					App.clearTrail();
					App.pushTrail("candidates");

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
								Utils.ShowToast({portal : false, type : "error", message : "Error fetching Job Types..."});
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
								Utils.ShowToast({portal : false, type : "error", message : "Error fetching Jobs..."});
							}
						})

					).then(function(){
						that.removeBackground();
						that.setLayout();
						that.setHeader("navigation");

						var view = new ViewCandidates({model : models});
							that.layout.body.show(view);
					});
				}else{
					App.router.navigate("login", true);
				}

			},

			candidatesByJob : function(id){

				var that = this;

				if(Utils.CheckSession()){
					App.clearTrail();
					App.pushTrail("jobs");
					App.pushTrail("candidates");

					var jobtypes = new ModelJobTypes();
					var jobs = new CollectionJobs({guid : id});
					var models = new Object();
						models.jobs = new Object();

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
								Utils.ShowToast({portal : false, type : "error", message : "Error fetching Job Types..."});
							}
						}),
						jobs.fetch({
							headers : {
								"token" : Utils.GetUserSession().brushfireToken
							},
							success : function(collection, jobsResponse){
								console.log("Jobs fetched successfully...");
								models.jobs.jobs = jobsResponse;
							},
							error : function(){
								console.log("Error fetching Jobs...");
								Utils.ShowToast({portal : false, type : "error", message : "Error fetching Jobs..."});
							}
						})

					).then(function(){
						that.removeBackground();
						that.setLayout();
						that.setHeader("navigation");

						var view = new ViewCandidates({model : models, mode : "child"});
							that.layout.body.show(view);
					});

				}else{
					App.router.navigate("login", true);
				}

			},

			network : function(){

				var that = this;

				if(Utils.CheckSession()){
					App.clearTrail();
					App.pushTrail("network");

					this.removeBackground();
					this.setLayout();
					this.setHeader("navigation");

					var view = new ViewNetwork();
					that.layout.body.show(view);
				}else{
					App.router.navigate("login", true);
				}
			},

			messages : function(){
				
				var that = this;

				if(Utils.CheckSession()){
					App.clearTrail();
					App.pushTrail("messages");

					this.removeBackground();
					this.setLayout();
					this.setHeader("navigation");

					var view = new ViewMessages();
					that.layout.body.show(view);
				}else{
					App.router.navigate("login", true);
				}
			},

			settings : function(){

				var that = this;

				if(Utils.CheckSession()){
					App.clearTrail();
					App.pushTrail("settings");

					this.removeBackground();
					this.setLayout();
					this.setHeader("navigation");

					var view = new ViewSettings();
					that.layout.body.show(view);
				}else{
					App.router.navigate("login", true);
				}
			},

			profile : function(id, selection){

				var that = this;

				if(Utils.CheckSession()){
					App.pushTrail("profile");

					this.removeBackground();
					this.setLayout();
					this.setHeader("navigation");

					var view = new ViewProfile();
					that.layout.body.show(view);
				}else{
					App.router.navigate("login", true);
				}
			},

			logout : function(){
				Utils.DeleteUserSession();
				App.router.navigate("login", true);
			}
			
		});

		return AppController;
	}
);