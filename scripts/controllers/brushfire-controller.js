define([
		"jquery",
        "app",
        "utils",
		"marionette",
		"scripts/layouts/layout-app",
		"scripts/views/view-login",
		"scripts/views/view-forgot-password",
		"scripts/views/view-signup",
		"scripts/views/view-find-business",
		"scripts/views/view-add-business",
		"scripts/views/view-account-verification",
		"scripts/views/view-head",
		"scripts/views/view-nav",
		"scripts/views/view-support-nav",
		"scripts/views/view-jobs",
		"scripts/views/view-candidates",
		"scripts/views/view-profile",
		"scripts/views/view-connections",
		"scripts/views/view-network",
		"scripts/views/view-messages",
		"scripts/views/view-settings",
		"scripts/views/view-employer-profile",
		"scripts/views/view-support",
		"scripts/views/view-select-employer",
		"scripts/models/model-jobtypes",
		"scripts/models/model-employer-ppa",
		"scripts/models/model-employer-yelp-rating",
		"scripts/collections/collection-jobs",
		"scripts/collections/collection-jobs-info",
		"scripts/collections/collection-employer-profile",
		"scripts/collections/collection-network",
		"scripts/collections/collection-employees",
		"scripts/collections/collection-followers",
		"scripts/collections/collection-endorsements",
	],
	function($, App, Utils, Marionette, LayoutApp, ViewLogin, ViewForgotPassword, ViewSignup, ViewFindBusiness, ViewAddBusiness, ViewAccountVerification, ViewHead, ViewNav, ViewSupportNav, ViewJobs, ViewCandidates, ViewProfile, ViewConnections, ViewNetwork, ViewMessages, ViewSettings, ViewEmployerProfile, ViewSupport, ViewSelectEmployer, ModelJobTypes, ModelEmployerPPA, ModelEmployerYelpRating, CollectionJobs, CollectionJobsInfo, CollectionEmployerProfiles, CollectionNetwork, CollectionEmployees, CollectionFollowers, CollectionEndorsements){
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
				$("#app-help").show();

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
					case "support" :
						var nav = new ViewSupportNav();
						this.layout.head.show(nav);
						$("#app-help").hide();
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

				if(Utils.CheckSession()){
					App.router.navigate("jobs", true);	
				}else{
					this.setLayout();
					this.setHeader("heading");
					this.setBackground();
				
					var view = new ViewLogin();
					this.layout.body.show(view);
				}
			},

			forgotPassword : function(){
				this.setLayout();
				this.setHeader("heading");
				this.setBackground();
				
				var view = new ViewForgotPassword();
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

				if(Utils.CheckSession()){

					this.setLayout();
					this.setHeader("heading");
					this.setBackground();

					var user = Utils.GetUserSession();

					var view = new ViewAccountVerification({model : user});
					this.layout.body.show(view);
				}else{
					App.router.navigate("login", true);
				}
			},

			jobs : function(){

				if(Utils.CheckSession()){

					var hasEmployerID = Utils.GetUserSession().employerIds.length > 0

					if(!hasEmployerID){
						App.router.navigate("logout", true);
					}else{
						var that = this;

						App.clearTrail();
						App.pushTrail(App.Language.jobs);

						var jobtypes = new ModelJobTypes();
						var jobs = new CollectionJobs();
						var models = new Object();

						$.when(
							jobtypes.fetch({
								success : function(jobtypesResponse){
									console.log("Job Types fetched successfully...");
									models.jobtypes = jobtypesResponse.attributes;
								},
								error : function(){
									console.log("Error fetching Job Types...");
									Utils.ShowToast({ message : "Error fetching Job Types..."});
								}
							}),
							jobs.fetch({
								success : function(collection, jobsResponse){
									console.log("Jobs fetched successfully...");
									models.jobs = jobsResponse;
								},
								error : function(){
									console.log("Error fetching Jobs...");
									Utils.ShowToast({message : "Error fetching Jobs..."});
								}
							})

						).then(function(){
							that.removeBackground();
							that.setLayout();
							that.setHeader("navigation");

							var view = new ViewJobs({model : models});
								that.layout.body.show(view);
						});	
					}

				}else{
					App.router.navigate("logout", true);
				}

				
			},

			candidates : function(){

				if(Utils.CheckSession()){

					var that = this;

					App.clearTrail();
					App.pushTrail(App.Language.candidates);

					var jobtypes = new ModelJobTypes();
					var jobs = new CollectionJobs();
					var models = new Object();

					$.when(
						jobtypes.fetch({
							success : function(jobtypesResponse){
								console.log("Job Types fetched successfully...");
								models.jobtypes = jobtypesResponse.attributes;
							},
							error : function(){
								console.log("Error fetching Job Types...");
								Utils.ShowToast({ message : "Error fetching Job Types..."});
							}
						}),
						jobs.fetch({
							success : function(collection, jobsResponse){
								console.log("Jobs fetched successfully...");
								models.jobs = jobsResponse;
							},
							error : function(){
								console.log("Error fetching Jobs...");
								Utils.ShowToast({ message : "Error fetching Jobs..."});
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
					App.pushTrail(App.Language.jobs);
					App.pushTrail(App.Language.candidates);

					var jobtypes = new ModelJobTypes();
					var jobs = new CollectionJobs({guid : id});
					var models = new Object();
						models.jobs = new Object();

					$.when(
						jobtypes.fetch({
							success : function(jobtypesResponse){
								console.log("Job Types fetched successfully...");
								models.jobtypes = jobtypesResponse.attributes;
							},
							error : function(){
								console.log("Error fetching Job Types...");
								Utils.ShowToast({ message : "Error fetching Job Types..."});
							}
						}),
						jobs.fetch({
							success : function(collection, jobsResponse){
								console.log("Jobs fetched successfully...");
								models.jobs.jobs = jobsResponse;
							},
							error : function(){
								console.log("Error fetching Jobs...");
								Utils.ShowToast({ message : "Error fetching Jobs..."});
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
					App.pushTrail(App.Language.network);

					var index = Utils.GetSelectedEmployer();
					var userGuid = Utils.GetUserSession().employerIds[index];
					var jobtypes = new ModelJobTypes();
					var jobsinfo = new CollectionJobsInfo();
					var employees = new CollectionEmployees({guid : userGuid});
					var followers = new CollectionFollowers({guid : userGuid});
					var endorsements = new CollectionEndorsements({guid : userGuid});
					var models = new Object();


					$.when(
						jobtypes.fetch({
							success : function(jobtypesResponse){
								console.log("Job Types fetched successfully...");
								models.jobtypes = jobtypesResponse.attributes;
							},
							error : function(){
								console.log("Error fetching Job Types...");
								Utils.ShowToast({ message : "Error fetching Job Types..."});
							}
						}),

						jobsinfo.fetch({
							success : function(jobsinfoResponse){
								console.log("Jobs Info fetched successfully...");
								models.jobsinfo = jobsinfoResponse.models;
							},
							error : function(){
								console.log("Error fetching Jobs info...");
								Utils.ShowToast({ message : "Error fetching Jobs info..."});
							}
						}),

						employees.fetch({
							success : function(response){
								models.employees = response.models;
							},
							error : function(){
								Utils.ShowToast({ message : "Error fetching employees..."});
							}
						}),

						followers.fetch({
							success : function(response){
								models.followers = response.models;
							},
							error : function(){
								Utils.ShowToast({ message : "Error fetching followers..."});
							}
						}),

						endorsements.fetch({
							success : function(response){
								models.endorsements = response.models;
							},
							error : function(){
								Utils.ShowToast({ message : "Error fetching endorsements..."});
							}
						})

					).then(function(){
						that.removeBackground();
						that.setLayout();
						that.setHeader("navigation");

						var view = new ViewNetwork({model : models});
							that.layout.body.show(view);
					});


				}else{
					App.router.navigate("login", true);
				}
			},

			messages : function(){
				
				var that = this;

				if(Utils.CheckSession()){
					App.clearTrail();
					App.pushTrail(App.Language.messages);

					this.removeBackground();
					this.setLayout();
					this.setHeader("navigation");

					var view = new ViewMessages();
					that.layout.body.show(view);
				}else{
					App.router.navigate("login", true);
				}
			},

			accountSettings : function(){

				var that = this;

				if(Utils.CheckSession()){
					App.clearTrail();
					App.pushTrail("Account Settings");

					this.removeBackground();
					this.setLayout();
					this.setHeader("navigation");

					var session = Utils.GetUserSession();
					var user = new Object();
						user.guid = session.guid;
						user.firstname = session.firstname;
						user.lastname = session.lastname;
						user.emailaddress = session.email;

					var view = new ViewSettings({model : user});
					that.layout.body.show(view);
				}else{
					App.router.navigate("login", true);
				}
			},

			profileSettings : function(){

				var that = this;

				if(Utils.CheckSession()){
					App.clearTrail();
					App.pushTrail("Profile Settings");

					this.removeBackground();
					this.setLayout();
					this.setHeader("navigation");


					var employerGUIDs = Utils.GetUserSession().employerIds;

					if(employerGUIDs.length != 0){
						var index = Utils.GetSelectedEmployer();
						var employerPPA = new ModelEmployerPPA();
						var employerYelpRating = new ModelEmployerYelpRating({guid : employerGUIDs[index]});
						var employerProfiles = new CollectionEmployerProfiles({guid : employerGUIDs[index]});
						var models = new Object();

						$.when(
							employerPPA.fetch({
								success : function(response){
									models.ppa = response.attributes;
								},
								error : function(){
									console.log("Error fetching employer ppa...")
									Utils.ShowToast({ message : "Error fetching employer ppa..."});
								}

							}),

							employerYelpRating.fetch({
								success : function(response){
									models.rating = response.attributes;
								},
								error : function(){
									console.log("Error fetching employer yelp rating...")
									Utils.ShowToast({ message : "Error fetching employer yelp rating..."});
								}

							}),

							employerProfiles.fetch({
								success : function(response){
									var modelProfiles = response.models;
										models.profile = response.models[0].attributes;
								},
								error : function(){
									console.log("Error fetching employer profiles...")
									Utils.ShowToast({ message : "Error fetching employer profiles..."});
								}
							})

						).then(function(){
							var view = new ViewEmployerProfile({model : models});
							that.layout.body.show(view);
						});

					}else{
						var view = new ViewEmployerProfile();
							that.layout.body.show(view);
					}


				}else{
					App.router.navigate("login", true);
				}
			},

			profile : function(id, selection){

				var that = this;

				if(Utils.CheckSession()){
					App.pushTrail(App.Language.profile);

					this.removeBackground();
					this.setLayout();
					this.setHeader("navigation");

					var view = new ViewProfile();
					that.layout.body.show(view);
				}else{
					App.router.navigate("login", true);
				}
			},

			support : function(){
				var that = this;

				if(Utils.CheckSession()){
					var roles = Utils.GetUserSession().roles;
					var support = Utils.IsSupportUser(roles);
					if(support){
						this.removeBackground();
						this.setLayout();
						this.setHeader("support");

						var view = new ViewSupport();
						that.layout.body.show(view);
					}else{
						App.router.navigate("logout", true);
					}

				}else{
					App.router.navigate("login", true);
				}
			},

			selectEmployer : function(){
				var that = this;
				if(Utils.CheckSession()){
					this.removeBackground();
					this.setLayout();
					this.setHeader("navigation");

					var view = new ViewSelectEmployer();
					that.layout.body.show(view);
				}else{
					App.router.navigate("login", true);
				}
			},

			logout : function(){
				Utils.DeleteUserSession();
				Utils.RemoveAdminEmployers();
				Utils.RemoveSharedConnectionName();
				Utils.RemoveSelectedEmployer();
				Utils.RemoveUserConnectionsList();
				App.router.navigate("login", true);
			}
			
		});

		return AppController;
	}
);