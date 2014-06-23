define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-settings"
	],
	function($, Cookie, App, Utils, Marionette, Template){
	"use strict";

	var ViewSettings = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #save-settings" : "saveSettings"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Settings view initialized...");
		},

		saveSettings : function(){

			var firstname = $("#firstname").val();
			var lastname = $("#lastname").val();
			var current = $("#current").val();
			var password = $("#password").val();
			var confirm = $("#confirm").val();

			if(current === ""){
				Utils.ShowToast({ message : "Current password is required"});
			}else if(password === ""){	
				Utils.ShowToast({ message : "New password is required"});
			}else if(confirm === ""){	
				Utils.ShowToast({ message : "Confirm password is required"});
			}else if(password !== confirm){
				Utils.ShowToast({ message : "Password does not match the confirm password"});
			}else{

				var user = this.model;
				var restURL = Utils.GetURL("/services/rest/user/");

				$.ajax({
					url : restURL+user.guid+"/password",
					type : "PUT",
					contentType: "application/x-www-form-urlencoded; charset=UTF-8",
					data : {"currentPassword" : current, "newPassword" : confirm},
	    			success : function(){
	    				Utils.ShowToast({ message : "Password saved"});
						$("#current").val("");
						$("#password").val("");
						$("#confirm").val("");
	    			},
	    			error : function(response){
	    				if(response.status === 400){
	    					console.log("Error saving user information...");
							Utils.ShowToast({ message : "Current password is incorrect"});
	    				}
	    			}
				});

			}

			
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.user = this.model;
				jsonObject.language = App.Language;
				jsonObject.breadcrumb = App.getTrail();
			return jsonObject;
		}
		
	});

	return ViewSettings;
});