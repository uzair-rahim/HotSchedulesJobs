define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-employer-profile",
		"scripts/models/model-employer-profile",
		"scripts/models/model-new-employer-admin",
		"scripts/models/model-delete-admin",
		"scripts/models/model-employer-logo"
	],
	function($, Cookie, App, Utils, Marionette, Template, EmployerProfile, NewAdmin, DeleteAdmin, EmployerLogo){
	"use strict";

	var ViewEmployerProfile = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		adminUserGUID : null,
		adminGUID : null,
		adminID : null,
		events : {
			"click #save-settings"	: "saveSettings",
			"click #upload-logo"	: "uploadLogo",
			"click #remove-logo"	: "removeLogo",
			"click #add-about"		: "addAbout",
			"click #add-admin"		: "addAdmin",
			"click #make-admin"		: "makeAdmin",
			"click .remove-admin"	: "removeAdmin",
			"change #logo-file"		: "startLogoUpload",
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Employer profile view initialized...");
			this.listenTo(App, "alertPrimaryAction", this.alertPrimaryAction);
			this.listenTo(App, "alertSecondaryAction", this.alertSecondaryAction);
		},

		uploadLogo : function(){
			$("#logo-file").click();
		},

		startLogoUpload : function(event){

			event.preventDefault();

			var file = event.currentTarget.files[0];
			var reader = new FileReader();

			reader.onload = function(e){
				var employerGUIDs = Utils.GetUserSession().employerIds;
				var logo = new EmployerLogo({guid : employerGUIDs[0]});
					logo.unset("guid");
					logo.set({file : e.target.result});
					console.log(logo);
					logo.save({
						success : function(){
					
					},
						error : function(){
							console.log("Error uploading logo...");
							Utils.ShowToast({ message : "Error uploading logo..."});
					}
				});
			}

			reader.readAsDataURL(file);
		},

		removeLogo : function(){
			Utils.ShowAlert({listener : "logo", primary : true, primaryType : "destroy", primaryText : "Remove", title : "Remove Logo", message : "Are you sure you wan't to remove the logo?" });
		},

		alertPrimaryAction : function(){
			var listener = $("#app-alert").attr("data-listener");
			switch(listener){
				case "logo":
					this.completeRemoveLogo();
				break;
				case "admin":
					this.completeRemoveAdmin();
				break;
			}
		},

		alertSecondaryAction : function(){
			var listener = $("#app-alert").attr("data-listener");
			switch(listener){
				case "logo":
					this.cancelRemoveLogo();
				break;
				case "admin":
					this.cancelRemoveAdmin();
				break;
			}
		},

		completeRemoveLogo : function(){

			var logoImage = $("#logo");

			if($(logoImage).length > 0){
				
				var employerGUIDs = Utils.GetUserSession().employerIds;
				var logo = new EmployerLogo({id : 0, guid : employerGUIDs[0]});

				logo.destroy({
					dataType : "text",
					success : function(){
						Utils.HideAlert();
						$(".logo-container .logo").html("");
						$("#logo-action .custom-select-button").text("Update Logo");
					},
					error : function(){
						console.log("Error removing admin...");
						Utils.ShowToast({ message : "Error removing logo..."});
					}
				})

			}else{
				Utils.HideAlert();
			}

		},

		cancelRemoveLogo : function(){
			Utils.HideAlert();
			$("#logo-action .custom-select-button").text("Update Logo");
		},

		completeRemoveAdmin : function(){
			Utils.HideAlert();

			var that = this;

			var employerGUIDs = Utils.GetUserSession().employerIds;
			var userGUID = Utils.GetUserSession().guid;
			var self = this.adminUserGUID == userGUID;
			var deleteAdmin = new DeleteAdmin({id : this.adminID, guid : employerGUIDs[0], admin : this.adminGUID});
		
				deleteAdmin.destroy({
					dataType : "text",
					success : function(response){
						if(self){
							App.router.controller.logout();
						}else{
							App.router.controller.profileSettings();
						}
						
					},
					error : function(){
						console.log("Error removing admin...");
						Utils.ShowToast({ message : "Error removing admin..."});
					}
				});
		},

		cancelRemoveAdmin : function(){
			Utils.HideAlert();
			$(".admin-container .custom-select-button").text("Admin");
		},

		saveSettings : function(){

			$("input").removeClass("error");

			var vldtRegister = vldt.validate({
				"#name"			: "alpha",
				"#street"		: "alphanumeric",
				"#city"			: "alpha",
				"#zip"			: "zip",
				"#phone"		: "phone"
			});

			if(!vldtRegister){
				
				var errors = vldt.getErrors();
				console.log(vldt.getErrors());

				for(var key in errors){
					if(errors[key] === false){
						$(key).addClass("error");
						switch(key){
							case "#name":
								Utils.ShowToast({message : "There are errors in the form..."});
							break;
							case "#street":
								Utils.ShowToast({message : "There are errors in the form..."});
							break;	
							case "#city":
								Utils.ShowToast({message : "There are errors in the form..."});
							break;
							case "#zip":
								Utils.ShowToast({message : "There are errors in the form..."});
							break;
							case "#phone":
								Utils.ShowToast({message : "There are errors in the form..."});
							break;
						}
					}
				}

				return false;

			}else{
				var employer = new Object();
					employer.id = this.model.profile.id;
					employer.guid = this.model.profile.guid;
					employer.name = $("#name").val();
					employer.url = $("#website").val();
					employer.phone = $("#phone").val();
					employer.ppa = $("#ppa").attr("data-index");

				var about = $("#about").val();

					if(about === "" || typeof(about) === "undefined"){
						about = null;
					}	
					
					employer.about = about;

				var address = new Object();	
				
					address.id = this.model.profile.location.id;
					address.address1 = $("#street").val();
					address.address2 = $("#street2").val();	
					address.city = $("#city").val();
					address.state = $("#state").text();
					address.zip = $("#zip").val();

					employer.location = address;

					var employerGUIDs = Utils.GetUserSession().employerIds;

					var profile = new EmployerProfile({guid : employerGUIDs[0]});

					profile.save(employer, {
						success : function(){
							App.router.controller.profileSettings();
						},
						error : function(){
							console.log("Error saving employer profile...");
							Utils.ShowToast({ message : "Error saving employer profile..."});
						}
					});

			}

		},

		addAbout : function(event){
			$(event.target).hide();
			$(".employer-profile-container").append('<div class="field-container about"><label>About</label><textarea id="about"></textarea></div>');
		},

		addAdmin : function(event){
			$("#add-admin").hide();
			$("#add-admin-container").show();
		},

		makeAdmin : function(){

			$("input").removeClass("error");

			var vldtAdmin = vldt.validate({
				"#admin-email" 	: "email"
			});

			if(!vldtAdmin){
				var errors = vldt.getErrors();
				console.log(vldt.getErrors());

				for(var key in errors){
					if(errors[key] === false){
						$(key).addClass("error");
						switch(key){
							case "#admin-email":
								Utils.ShowToast({ message : "Invalid Email Address"});
							break;
						}
					}
				}

				return false;

			}else{
				var employerGUIDs = Utils.GetUserSession().employerIds;
				var newAdmin = new NewAdmin({guid : employerGUIDs[0]});
					newAdmin.unset("guid");
				var email = $("#admin-email").val();

				var admin = {"email" : email}

				newAdmin.save(admin, {
					success : function(response){
						App.router.controller.profileSettings();
					},
					error : function(){
						console.log("Error adding admin to employer...");
						Utils.ShowToast({ message : "Error adding admin to employer..."});
					}
				});	
			}

		},

		removeAdmin : function(event){
			var id = $(event.target).attr("id");
			var guid = $(event.target).attr("data-guid");
			var userGuid = $(event.target).attr("data-user");
			this.adminID = id;
			this.adminGUID = guid;
			this.adminUserGUID = userGuid;
			Utils.ShowAlert({listener : "admin", primary : true, primaryType : "destroy", primaryText : "Remove", title : "Remove Admin", message : "Are you sure you wan't to remove this admin?" });
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.employerPPA = this.model.ppa;
				jsonObject.employerRating = this.model.rating;
				jsonObject.employerProfile = this.model.profile;
				jsonObject.language = App.Language;
				jsonObject.breadcrumb = App.getTrail();
			return jsonObject;
		}
		
	});

	return ViewEmployerProfile;
});