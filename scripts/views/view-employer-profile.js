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
			"click #save-settings" : "saveSettings"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Employer profile view initialized...");
		},

		saveSettings : function(){
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