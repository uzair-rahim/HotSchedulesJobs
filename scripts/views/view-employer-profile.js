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
			"click #upload-logo"	: "uploadLogo"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Employer profile view initialized...");
		},

		uploadLogo : function(){
			console.log("upload");
		},

		saveSettings : function(){

			$("input").removeClass("error");

			var vldtRegister = vldt.validate({
				"#name"			: "alpha",
				"#street"		: "alphanumeric",
				"#city"			: "alpha",
				"#zip"			: "zip",
				"#phone"		: "alphanumeric",
				"#website"		: "alphanumeric"
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
							case "#website":
								Utils.ShowToast({message : "There are errors in the form..."});
							break;
						}
					}
				}

				return false;

			}else{
				var employer = new Object();
					employer.id = this.model.id;
					employer.guid = this.model.guid;
					employer.name = $("#name").val();
					employer.url = $("#website").val();
					employer.phone = $("#phone").val();

				var address = new Object();	
				
					address.id = this.model.location.id;
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
							Utils.ShowToast({ message : "Error employer profile..."});
						}
					});

			}

		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.employerProfile = this.model;
				jsonObject.language = App.Language;
				jsonObject.breadcrumb = App.getTrail();
			return jsonObject;
		}
		
	});

	return ViewEmployerProfile;
});