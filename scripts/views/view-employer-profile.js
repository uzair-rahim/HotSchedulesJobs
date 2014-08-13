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
			"change #logo-file"		: "resizeLogo"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Employer profile view initialized...");
			this.listenTo(App, "alertPrimaryAction", this.alertPrimaryAction);
			this.listenTo(App, "alertSecondaryAction", this.alertSecondaryAction);

			$(document.body).delegate("#save-logo", "click", this.startLogoUpload);
		},

		uploadLogo : function(){
			$("#logo-file").click();
		},

		resizeLogo : function(){
			var logo = $("#logo-file")[0].files[0];
			if(logo.size > 4194304){
				Utils.ShowAlert({ listener : "logo", title : "File Size Too Large", message : "The selected image file size is too large and exceeds the allowed limit of 4MB", primary : false, secondaryText : "Ok" });
			}else{

				var _URL = window.URL || window.webkitURL;
				var image = new Image();
	    		image.src = _URL.createObjectURL(logo);

	    		image.onload = function(){
	    			var alert = $("#app-alert-resize-logo");
	    			var overlay = $(alert).find(".resize-logo-container .overlay")
	    			
	    			$(alert).find(".resize-logo-container .overlay").after("<img class='resize-logo-image' src='"+image.src+"'/>");
					$(alert).addClass("show");
					$(document).find("#app-modal").addClass("show");

					var containerWidth = $(".resize-logo-container").width();
					var containerHeight = $(".resize-logo-container").height();

					var imagePosition = $(".resize-logo-image").offset();
					var imageWidth = $(".resize-logo-image").width();
					var imageHeight = $(".resize-logo-image").height();
							
					var x1 = (imagePosition.left + containerWidth) - imageWidth;
					var y1 = (imagePosition.top + containerHeight) - imageHeight;
					var x2 = imagePosition.left;
					var y2 = imagePosition.top;

					$(".resize-logo-image").draggable({containment : [x1,y1,x2,y2]});
	    		}
			}
		},

		startLogoUpload : function(event){

			var employerGUIDs = Utils.GetUserSession().employerIds;
			var index = Utils.GetSelectedEmployer();
			var guid = employerGUIDs[index];

			var container = $(document).find(".resize-logo-container");
			var containerX = $(container).offset().left;
			var containerY = $(container).offset().top;

			var image = $(document).find(".resize-logo-image");
			var imageWidth = $(image).width();
			var imageHeight = $(image).height();

			var imageX = $(image).offset().left;
			var imageY = $(image).offset().top;

			var crop = new Object();
				crop.imageWidth = imageWidth;
				crop.imageHeight = imageHeight;
				crop.cropWidth = 200;
				crop.cropHeight = 200;
				crop.cropFromX = containerX - imageX;
				crop.cropFromY = containerY - imageY;

			var params = new Blob([JSON.stringify(crop)], { type: "application/json"});
			
			$(document).find("#app-alert-resize-logo").removeClass("show");
			$(document).find("#app-modal").removeClass("show");
			$(document).find("#app-alert-resize-logo img.resize-logo-image").remove();
			$(document).find(".resize-slider-container .slider .handle").css("left", 75);

			var logo = $("#logo-file")[0].files[0];

			var data = new FormData();
				data.append("file", logo);
				data.append("params", params, null);
				
				

			var restURL = Utils.GetURL("/services/rest/employer/logo/");

			$.ajax({
				url : restURL+guid,
				data : data,
				type : "POST",
				dataType : "json",
				cache : false,
				contentType : false,
				processData: false,
	    		success : function(response){
	    			$("#logo").remove();
					$(".logo-container .logo").append("<img id='logo' src='"+response.url+"?"+(new Date().getTime())+"'/>");
	    		},
	    		error : function(){
	    			console.log("Error uploading logo...");
					Utils.ShowToast({ message : "Error uploading logo..."});
	    		}
			});

		},

		removeLogo : function(){
			Utils.ShowAlert({listener : "logo", primary : true, primaryType : "destroy", primaryText : "Remove", title : "Remove Logo", message : "Are you sure you want to remove the logo?" });
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

			Utils.HideAlert();

			var logoImage = $("#logo");

			if($(logoImage).length > 0){
				
				var employerGUIDs = Utils.GetUserSession().employerIds;
				var index = Utils.GetSelectedEmployer();
				var logo = new EmployerLogo({id : 0, guid : employerGUIDs[index]});

				logo.destroy({
					dataType : "text",
					success : function(){
						$(".logo-container .logo").html("");
						$("#logo-action .custom-select-button").text("Update Logo");
					},
					error : function(){
						console.log("Error removing admin...");
						Utils.ShowToast({ message : "Error removing logo..."});
					}
				})

			}else{
				$(".logo-container .logo").html("");
				$("#logo-action .custom-select-button").text("Update Logo");
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
			var index = Utils.GetSelectedEmployer();
			var deleteAdmin = new DeleteAdmin({id : this.adminID, guid : employerGUIDs[index], admin : this.adminGUID});
		
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
				"#name"			: "alphanumeric",
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
					employer.currency = new Object();
					employer.currency.currencyCode = "USD";

				var address = new Object();	
				
					address.id = this.model.profile.location.id;
					address.address1 = $("#street").val();
					address.address2 = $("#street2").val();	
					address.city = $("#city").val();
					address.state = $("#state").text();
					address.zip = $("#zip").val();

					employer.location = address;

					var employerGUIDs = Utils.GetUserSession().employerIds;
					var index = Utils.GetSelectedEmployer();

					var profile = new EmployerProfile({guid : employerGUIDs[index]});

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
				var index = Utils.GetSelectedEmployer();
				var newAdmin = new NewAdmin({guid : employerGUIDs[index]});
					newAdmin.unset("guid");
				var email = $("#admin-email").val();

				var admin = {"email" : email}

				newAdmin.save(admin, {
					success : function(response){
						App.router.controller.profileSettings();
					},
					error : function(x, s, e){
						console.log("Error adding admin to employer...");
						if(s.status === 400 && s.responseJSON.errorCode === 14){
							Utils.ShowToast({ message : "User is already an admin"});
						}else if(s.status === 404 && s.responseJSON.errorCode === 6){
							Utils.ShowToast({ message : "User not found"});
						}else{
							Utils.ShowToast({ message : "Error adding admin to employer..."});
						}
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
			Utils.ShowAlert({listener : "admin", primary : true, primaryType : "destroy", primaryText : "Remove", title : "Remove Admin", message : "Are you sure you want to remove this admin?" });
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.employerPPA = this.model.ppa;
				jsonObject.employerRating = this.model.rating;
				jsonObject.employerProfile = this.model.profile;
				jsonObject.language = App.Language;
				jsonObject.breadcrumb = App.getTrail();
				jsonObject.bust = new Date().getTime();
			return jsonObject;
		}
		
	});

	return ViewEmployerProfile;
});