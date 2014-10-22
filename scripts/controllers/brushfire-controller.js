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
		"scripts/views/view-jobs",
		"scripts/views/view-candidates",
		"scripts/views/view-candidates-by-job",
		"scripts/views/view-profile",
		"scripts/views/view-connections",
		"scripts/views/view-network",
		"scripts/views/view-messages",
		"scripts/views/view-settings",
		"scripts/views/view-employer-profile",
		"scripts/views/view-support",
		"scripts/views/view-select-employer",
		"scripts/views/view-training",
		"scripts/models/model-user",
		"scripts/models/model-jobtypes",
		"scripts/models/model-employer",
		"scripts/models/model-employer-ppa",
		"scripts/models/model-employer-yelp-rating",
		"scripts/models/model-chat",
		"scripts/collections/collection-employers",
		"scripts/collections/collection-jobs",
		"scripts/collections/collection-jobs-info",
		"scripts/collections/collection-employer-profile",
		"scripts/collections/collection-network",
		"scripts/collections/collection-employees",
		"scripts/collections/collection-followers",
		"scripts/collections/collection-endorsements",
	],
	function($, App, Utils, Marionette, LayoutApp, ViewLogin, ViewForgotPassword, ViewSignup, ViewFindBusiness, ViewAddBusiness, ViewAccountVerification, ViewJobs, ViewCandidates, ViewCandidatesByJob, ViewProfile, ViewConnections, ViewNetwork, ViewMessages, ViewSettings, ViewEmployerProfile, ViewSupport, ViewSelectEmployer, ViewTraining, ModelUser, ModelJobTypes, ModelEmployer, ModelEmployerPPA, ModelEmployerYelpRating, ModelChat, CollectionEmployers, CollectionJobs, CollectionJobsInfo, CollectionEmployerProfiles, CollectionNetwork, CollectionEmployees, CollectionFollowers, CollectionEndorsements){
		"use strict";

		var AppController = Marionette.Controller.extend({

			layout : null,

			setLayout : function(){
				console.log("Setting layout...");
			},

			setBackground : function(){
				var app = $(document).find(".app");

				if(!$(app).hasClass("background")){
					$(app).addClass("background");
					$(app).addClass("portal");
				}
			},

			removeBackground : function(){
				var app = $(document).find(".app");

				if($(app).hasClass("background")){
					$(app).removeClass("background");
					$(app).removeClass("portal");
				}
			},

			session : function(){
				console.log("App routed to session...");

				this.setLayout();

				if(App.session.isLoggedIn() && App.session.isVerified()){
					App.router.navigate("jobs", true);	
				}else{
					App.router.navigate("login", true);	
				}
				
			},

			login : function(){

				if(App.session.isLoggedIn() && App.session.isVerified()){
					App.router.navigate("jobs", true);	
				}else{
					this.setLayout();
					this.setBackground();
				
					var view = new ViewLogin();
					App.layout.body.show(view);
				}
			},

			sso : function(qp){
				var params = Utils.GetQueryParameters(qp);

				if(!params){
					App.router.navigate("logout", true);
				}else{
					var user = new Object();
					user.guid = params.u;
					user.firstname = params.fn;
					user.lastname = params.ln;
					user.email = params.email;
					user.verified = true;
					user.employerIds = [params.e];
					user.roles = ["employerAdmin", "user"];
					
					Utils.CreateUserSession(user);
					App.router.navigate("jobs", true);
				}

			},

			forgotPassword : function(){
				this.setLayout();
				this.setBackground();
				
				var view = new ViewForgotPassword();
				App.layout.body.show(view);
			},

			signup : function(){
				this.setLayout();
				this.setBackground();

				var view = new ViewSignup();
				App.layout.body.show(view);
			},

			findBusiness : function(){
				this.setLayout();
				this.setBackground();

				var view = new ViewFindBusiness();
				App.layout.body.show(view);
			},

			addBusiness : function(){
				this.setLayout();
				this.setBackground();

				var view = new ViewAddBusiness();
				App.layout.body.show(view);
			},

			accountVerification : function(){

				if(App.session.isLoggedIn() && !App.session.isVerified()){

					this.setLayout();
					this.setBackground();

					var user = Utils.GetUserSession();

					var view = new ViewAccountVerification({model : user});
					App.layout.body.show(view);
				}else{
					App.router.navigate("login", true);
				}
			},

			jobs : function(){

				if(App.session.isLoggedIn() && App.session.isVerified()){

					var hasEmployerID = App.session.getEmployers().length > 0

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

							var view = new ViewJobs({model : models});
								App.layout.body.show(view);
								if(localStorage.getItem("training") == "null"){
									that.training();
								}
								
						});	
					}

				}else{
					App.router.navigate("logout", true);
				}

				
			},

			candidates : function(){

				if(App.session.isLoggedIn() && App.session.isVerified()){

					var that = this;

					App.clearTrail();
					App.pushTrail(App.Language.candidates);

					var index = Utils.GetSelectedEmployer();
					var employerGUID = this.getEmployerGUID();
					var jobtypes = new ModelJobTypes();
					var employer = new ModelEmployer();
					var models = new Object();

					employer.getCandidatesByEmployerGUID(employerGUID,0,15,0,function(response){
						models.candidates = response;

						employer.getCandidatesByEmployerGUID(employerGUID,0,15,1,function(response){
							models.archived = response;

							jobtypes.fetch({
								success : function(jobtypesResponse){
									console.log("Job Types fetched successfully...");
									models.jobtypes = jobtypesResponse.attributes;
									that.removeBackground();
									that.setLayout();
									var view = new ViewCandidates({model : models});
										App.layout.body.show(view);
								},
								error : function(){
									console.log("Error fetching Job Types...");
									Utils.ShowToast({ message : "Error fetching Job Types..."});
								}
							});
						});
					});
				}else{
					App.router.navigate("login", true);
				}

			},

			candidatesByJob : function(id){

				var that = this;

				if(App.session.isLoggedIn() && App.session.isVerified()){
					App.clearTrail();
					App.pushTrail(App.Language.jobs);
					App.pushTrail(App.Language.candidates);

					var jobtypes = new ModelJobTypes();
					var jobs = new CollectionJobs();
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

						var view = new ViewCandidatesByJob({model : models, mode : "child"});
							App.layout.body.show(view);
					});

				}else{
					App.router.navigate("login", true);
				}

			},

			network : function(){

				var that = this;

				if(App.session.isLoggedIn() && App.session.isVerified()){
					App.clearTrail();
					App.pushTrail(App.Language.network);

					var jobtypes = new ModelJobTypes();
					var jobsinfo = new CollectionJobsInfo();
					var employees = new CollectionEmployees();
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
						})

					).then(function(){
						that.removeBackground();
						that.setLayout();

						var view = new ViewNetwork({model : models});
							App.layout.body.show(view);
					});


				}else{
					App.router.navigate("login", true);
				}
			},

			messages : function(){
				
				var that = this;

				if(App.session.isLoggedIn() && App.session.isVerified()){
					App.clearTrail();
					App.pushTrail(App.Language.messages);

					this.removeBackground();
					this.setLayout();

					var employerGUID = this.getEmployerGUID();

					var chat = new ModelChat();
						chat.getEmployerChats(employerGUID,0,0,function(data){
							var view = new ViewMessages({model : data});
							App.layout.body.show(view);
						});
				}else{
					App.router.navigate("login", true);
				}
			},

			accountSettings : function(){

				var that = this;

				if(App.session.isLoggedIn() && App.session.isVerified()){
					App.clearTrail();
					App.pushTrail("Account Settings");

					this.removeBackground();
					this.setLayout();

					var session = Utils.GetUserSession();
					var user = new Object();
						user.guid = session.guid;
						user.firstname = session.firstname;
						user.lastname = session.lastname;
						user.emailaddress = session.email;

					var view = new ViewSettings({model : user});
					App.layout.body.show(view);
				}else{
					App.router.navigate("login", true);
				}
			},

			profileSettings : function(){

				var that = this;

				if(App.session.isLoggedIn() && App.session.isVerified()){
					App.clearTrail();
					App.pushTrail("Profile Settings");

					this.removeBackground();
					this.setLayout();

					var employerGUID = App.router.controller.getEmployerGUID();

					var employerPPA = new ModelEmployerPPA();
					var employerYelpRating = new ModelEmployerYelpRating({guid : employerGUID});
					var employerProfiles = new CollectionEmployerProfiles({guid : employerGUID});
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
						App.layout.body.show(view);
					});

				}else{
					App.router.navigate("login", true);
				}
			},

			profile : function(id, selection){

				var that = this;

				if(App.session.isLoggedIn() && App.session.isVerified()){
					App.pushTrail(App.Language.profile);

					this.removeBackground();
					this.setLayout();

					var view = new ViewProfile();
					App.layout.body.show(view);
				}else{
					App.router.navigate("login", true);
				}
			},

			support : function(){
				var that = this;

				if(App.session.isLoggedIn() && App.session.isVerified()){
					var roles = Utils.GetUserSession().roles;
					var support = Utils.IsSupportUser(roles);
					if(support){
						this.removeBackground();
						this.setLayout();

						var view = new ViewSupport();
						App.layout.body.show(view);
					}else{
						App.router.navigate("logout", true);
					}

				}else{
					App.router.navigate("login", true);
				}
			},

			training : function(){
				var training = new ViewTraining();
				var container = App.layout.el;
					$(container).append(training.render().el);

			},

			selectEmployer : function(){
				var that = this;
				if(App.session.isLoggedIn() && App.session.isVerified()){
					this.removeBackground();
					this.setLayout();

					var view = new ViewSelectEmployer();
					App.layout.body.show(view);
				}else{
					App.router.navigate("login", true);
				}
			},

			logout : function(){
				Utils.RemoveAdminEmployers();
				Utils.RemoveSharedConnectionName();
				Utils.RemoveSelectedEmployer();
				Utils.RemoveUserConnectionsList();
				App.session.set({logged : false, expired : false});
				App.router.navigate("login", true);
			},

			// Processes

			redirectOnLogin : function(){
				if(App.session.isVerified()){
					var userGUID = App.session.get("guid");
					var user = new ModelUser({guid : userGUID});
						user.getProfilePhoto(function(data){
							// Set photo in session
							App.session.set("photo", data);
							// If user is user then...
							if(App.session.isUser()){
								// ...go to search jobs screen
								App.router.navigate("findBusiness", true);
							}else if(App.session.isSupport()){
								App.router.navigate("support", true);
							}else{
								// ...get all employers and go to default
								var userEmployers = App.session.getEmployers();
								var collection = new CollectionEmployers();
									collection.getEmployers(userEmployers, function(){
										App.session.set({employers : collection.models});
										App.menu.render();
										var route = Utils.GetDefaultRoute();
										App.router.navigate(route, true);
									});
							}
						});

				}else{
					App.router.navigate("accountVerification", true);
				}
			},

			getEmployerGUID : function(){
				var selectedEmployer = App.session.get("selectedEmployer");
				var employers = App.session.get("employers");
				var guid = employers[selectedEmployer].guid;
				return guid;
			}
			
		});

		return AppController;
	}
);