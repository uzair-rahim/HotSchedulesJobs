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
		"scripts/views/view-premium-services",
		"scripts/views/view-support",
		"scripts/views/view-select-employer",
		"scripts/views/view-training",
		"scripts/models/model-user",
		"scripts/models/model-job",
		"scripts/models/model-jobtypes",
		"scripts/models/model-employer",
		"scripts/models/model-employer-ppa",
		"scripts/models/model-employer-type",
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
	function($, App, Utils, Marionette, LayoutApp, ViewLogin, ViewForgotPassword, ViewSignup, ViewFindBusiness, ViewAddBusiness, ViewAccountVerification, ViewJobs, ViewCandidates, ViewCandidatesByJob, ViewProfile, ViewConnections, ViewNetwork, ViewMessages, ViewSettings, ViewEmployerProfile, ViewPremium, ViewSupport, ViewSelectEmployer, ViewTraining, ModelUser, ModelJob, ModelJobTypes, ModelEmployer, ModelEmployerPPA, ModelEmployerType, ModelEmployerYelpRating, ModelChat, CollectionEmployers, CollectionJobs, CollectionJobsInfo, CollectionEmployerProfiles, CollectionNetwork, CollectionEmployees, CollectionFollowers, CollectionEndorsements){
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
					this.setMenuSelection("#menu-jobs");	
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
					App.session.removeUserSession();

					var user = new Object();
						user.guid = params.u;
						user.firstname = params.fn;
						user.lastname = params.ln;
						user.email = params.email;
						user.verified = true;
						user.logged = true;
						user.employers = [params.e];
						user.roles = ["employerAdmin", "user"];

						var that = this;

					var collection = new CollectionEmployers();
						collection.getEmployers(user.employers, function(){
							
							user.employers = collection.models;

							var userModel = new ModelUser();
								userModel.getUserEventByType(user.guid,0,function(response){
								user.trainingCompleted = response.completed !== null;
								user.trainingEventGUID = response.guid;

								App.session.set(user);		
								App.menu.render();

								App.router.navigate("jobs", true);
								if(!App.session.get("trainingCompleted")){
									that.training();
								}

							});

						});
					
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
				if(!App.session.isVerified()){

					this.setLayout();
					this.setBackground();

					var user = new Object();
						user.email = App.session.get("email");

					var view = new ViewAccountVerification({model : user});
					App.layout.body.show(view);
				}else{
					App.router.navigate("login", true);
				}
			},

			jobs : function(){
				if(App.session.isLoggedIn() && App.session.isVerified()){
					var that = this;
					var data = new Object();
					var job = new ModelJob();
						job.getJobTypes(function(response){
							data.types = response;
							job.getEmployerJobs(App.session.getEmployerGUID(), function(response){
								data.jobs = response;
								that.removeBackground();
								var view = new ViewJobs({model : data});
								App.layout.body.show(view);
								that.setMenuSelection("#menu-jobs");	
							});
						});
				}else{
					App.router.navigate("logout", true);
				}
			},

			candidates : function(){

				if(App.session.isLoggedIn() && App.session.isVerified()){

					var that = this;

					App.clearTrail();
					App.pushTrail(App.Language.candidates);

					var employerGUID = App.session.getEmployerGUID();
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
										that.setMenuSelection("#menu-candidates");	
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
								that.setMenuSelection("#menu-candidates");
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
							that.setMenuSelection("#menu-network");	
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

					var employerGUID = App.session.getEmployerGUID();

					var chat = new ModelChat();
						chat.getEmployerChats(employerGUID,0,0,function(data){
							var view = new ViewMessages({model : data});
							App.layout.body.show(view);
							that.setMenuSelection("#menu-messages");
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

					var user = new Object();
						user.guid = App.session.get("guid");
						user.firstname = App.session.get("firstname");
						user.lastname = App.session.get("lastname");
						user.emailaddress = App.session.get("email");

					var view = new ViewSettings({model : user});
					App.layout.body.show(view);
					that.setMenuSelection("#menu-account-settings");	
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

					var employerGUID = App.session.getEmployerGUID();

					var employerPPA = new ModelEmployerPPA();
					var employerType = new ModelEmployerType();
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
						
						employerType.fetch({
							success : function(response){
								models.type = response.attributes;
							},
							error : function(){
								console.log("Error fetching employer type...")
								Utils.ShowToast({ message : "Error fetching employer type..."});
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
						that.setMenuSelection("#menu-profile-settings");	
					});

				}else{
					App.router.navigate("login", true);
				}
			},

			premiumServices : function(){

                var that = this;

            	if(App.session.isLoggedIn() && App.session.isVerified()){
            		App.clearTrail();
            		App.pushTrail("Premium Services");

            		this.removeBackground();
            		this.setLayout();

            		var mdl = new Object();
                    	mdl.employerGuid = App.session.getEmployerGUID();
                    	mdl.userEmail = App.session.get("email");

   					var view = new ViewPremium({model : mdl});
                    App.layout.body.show(view);
                    that.setMenuSelection("#menu-premium-services");

            	} else {
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
					var roles = App.session.get("roles");
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
					if(App.session.get("employers").length > 1){
						this.removeBackground();
						this.setLayout();

						var view = new ViewSelectEmployer();
						App.layout.body.show(view);
					}else{
						App.router.navigate("jobs", true);	
					}
				}else{
					App.router.navigate("login", true);
				}
			},

			logout : function(){
				Utils.RemoveSharedConnectionName();
				Utils.RemoveUserConnectionsList();
				App.session.endSession();
				App.router.navigate("login", true);
			},

			// Processes

			redirectOnLogin : function(){
				if(App.session.isVerified()){
					var that = this;
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
								App.session.set("logged", true);
								App.router.navigate("support", true);
							}else{
								// ...get all employers and go to default
								var userEmployers = App.session.getEmployers();
								var collection = new CollectionEmployers();
									collection.getEmployers(userEmployers, function(){
										App.session.set("logged", true);
										App.session.set({employers : collection.models});
										Utils.EnablePremiumTab(
										    App.session.getEmployers()[App.session.getSelectedEmployer()].premium
										);
										App.menu.render();
										var route = Utils.GetDefaultRoute();
										App.router.navigate(route, true);
										if(!App.session.get("trainingCompleted")){
											that.training();
										}
									});
							}
						});

				}else{
					App.router.navigate("accountVerification", true);
				}
			},

			setMenuSelection : function(item){
				App.menu.setSelection(item);
			},
			
		});

		return AppController;
	}
);