define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-employer-profile",
		"scripts/models/model-employer-profile"
	],
	function($, Cookie, App, Utils, Marionette, Template, EmployerProfile){
	"use strict";

	var ViewEmployerProfile = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #save-settings"	: "saveSettings",
			"click #upload-logo"	: "uploadLogo",
			"click #remove-logo"	: "removeLogo",
			"click #add-about"		: "addAbout",
			"click #add-admin"		: "addAdmin",
			"click #make-admin"		: "makeAdmin",
			"change #logo-file"		: "startLogoUpload",
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Employer profile view initialized...");
			this.listenTo(App, "alertPrimaryAction", this.completeRemoveLogo);
			this.listenTo(App, "alertSecondaryAction", this.cancelRemoveLogo);
		},

		uploadLogo : function(){
			$("#logo-file").click();
		},

		startLogoUpload : function(){
			var _URL = window.URL || window.webkitURL;
			var file = document.getElementById("logo-file");
			var logo = file.files[0];

			console.log(file.files);

			if(file.files.length !== 0){

				var size = file.files[0].size;

				if(size > 1048576){
					Utils.ShowAlert({ title : "File Size Too Large", message : "The selected image file size is too large and exceeds the allowed limit of 1MB?", primary : false, secondaryText : "Ok" });
				}else{
					var image = new Image();
						image.src = _URL.createObjectURL(logo);
						image.onload = function(){
							var imageWidth = this.width;
							var imageHeight = this.height;
							
							var logoImage = $("#logo");
							var logoWidth = "85px";
							var logoHeight = "85px";

							if(imageWidth > imageHeight){
								logoWidth = "auto"; 
							}else if(imageWidth < imageHeight){
								logoHeight = "auto";
							}
							
							console.log(imageWidth + " x " + imageHeight + " " + size + " bytes");



							if($(logoImage).length > 0){
								$(logoImage).attr("src", image.src);
							}else{
								$(".logo-container .logo").append("<img id='logo' src='"+image.src+"'/>");
							}

							$(".logo-container .logo img").css({"width" : logoWidth, "height" : logoHeight});


						}
	
				}

			}

			
		},

		removeLogo : function(){
			Utils.ShowAlert({primary : true, primaryType : "destroy", primaryText : "Remove", title : "Remove Logo", message : "Are you sure you wan't to remove the logo?" });
		},

		completeRemoveLogo : function(){
			$(".logo-container .logo").html("");
			Utils.HideAlert();
			$("#logo-action .custom-select-button").text("Update Logo");
		},

		cancelRemoveLogo : function(){
			Utils.HideAlert();
			$("#logo-action .custom-select-button").text("Update Logo");
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

		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.employerPPA = this.model.ppa;
				jsonObject.employerProfile = this.model.profile;
				jsonObject.language = App.Language;
				jsonObject.breadcrumb = App.getTrail();
			return jsonObject;
		}
		
	});

	return ViewEmployerProfile;
});