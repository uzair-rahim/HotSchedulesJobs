define([
		"backbone",
	],
	function(Backbone){
		var Session = Backbone.Model.extend({

			defaults : {
				logged 				: false,
				verified 			: false,
				expired				: false,
				remember 			: false,
				guid				: null,
				firstname			: null,
				lastname			: null,
				photo				: null,
				email 				: null,
				employers			: null,
				selectedEmployer	: 0,
				roles				: null,
				notificationsCount	: 0,
				trainingCompleted	: false,
				trainingEventGUID	: null
			},

			initialize : function(options){
				console.log("Session model initialized...");
				this.on("change", this.updateUserSession);
				this.on("change:logged", this.loggedChanged);
				this.on("change:expired", this.sessionExpired);
				this.on("change:photo", this.photoChanged);
				this.on("change:selectedEmployer", this.employerChanged);
				this.on("change:notificationsCount", this.notificationsChanged);
			},

			// Check to see if the user data is present
			checkUserSession : function(){
				return localStorage.getItem("BrushfireSession") === null;
			},

			// Create a user data local storage key
			createUserSession : function(options){
				var defaults = this.defaults;

				if(typeof(options) === "undefined"){
					options = {};
				}

				for(var key in defaults){
					if(typeof(options[key]) === "undefined"){
						options[key] = defaults[key];
					}
				}

				localStorage.setItem("BrushfireSession", JSON.stringify(options));
			},

			// Remove the user data local storage key
			removeUserSession : function(){
				localStorage.removeItem("BrushfireSession");
			},

			// Get user data info
			getUserSession : function(){
				// If the user data local storage key does not exist create a new user data local storage key with default model values
				if(this.checkUserSession()){
					this.createUserSession();
				}else{
				// If the user data local storage key is present set the model attributes to keys's value
					var existingData = JSON.parse(localStorage.getItem("BrushfireSession"));
					this.set(existingData);
				}
				return this.attributes;
			},

			// Update user data info
			updateUserSession : function(){
				this.trigger("stateChanged");
				var changes = this.attributes;
				this.createUserSession(changes);
			},

			// Trigger logged changed
			loggedChanged : function(){
				this.trigger("loggedChanged");
			},

			// Trigger session expired
			sessionExpired : function(){
				this.trigger("sessionExpired");
			},

			// Trigger photo changed
			photoChanged : function(){
				this.trigger("photoChanged");
			},

			// Trigger employer changed
			employerChanged : function(){
				this.trigger("employerChanged");
			},

			// Trigger notifications changed
			notificationsChanged : function(){
				this.trigger("notificationsChanged");
			},

			// Helper Methods

			isLoggedIn : function(){
				return this.attributes.logged;
			},

			isVerified : function(){
				return this.attributes.verified;
			},

			isRememberMe : function(){
				return this.attributes.remember;
			},

			getEmployers : function(){
				return this.attributes.employers;
			},

			getSelectedEmployer : function(){
				return this.attributes.selectedEmployer;
			},

			getEmployerGUID : function(){
				return this.attributes.employers[this.attributes.selectedEmployer].guid;
			},

			getEmail : function(){
				return this.attributes.email;
			},

			getRole : function(){
				var roles = this.attributes.roles;
				var levels = ["user", "employerAdmin", "support"];
				
				var previousLevel = 0;
				var currentLevel = 0;
				var currentRole = "user";
				var role = currentRole;

				$.each(roles, function(){
					currentRole = this.role;
					$.each(levels, function(index){
						if(currentRole == this){
							currentLevel = index;
						}
						if(currentLevel > previousLevel){
							previousLevel = currentLevel;
							role = currentRole;
						}
					})
				});

				return role;
			},

			isUser : function(){
				return this.getRole() === "user";
			},

			isAdmin : function(){
				return this.getRole() === "employerAdmin";
			},

			isSupport : function(){
				return this.getRole() === "support";
			},

			endSession : function(){
				this.attributes.logged = false;
				this.attributes.expired = false;
				this.attributes.employers = null;
				this.updateUserSession();
			}

		});

		return Session;
	}
);