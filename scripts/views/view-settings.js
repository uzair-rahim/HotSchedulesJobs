define([
		"jquery",
		"jquerycookie",
		"analytics",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-settings"
	],
	function($, Cookie, Analytics, App, Utils, Marionette, Template){
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

		onShow : function(){
			ga('create', 'UA-52257201-1', 'hotschedulespost.com');
      		ga('send', 'pageview', '/settings');
		},

		saveSettings : function(){

			$("input").removeClass("error");

			var firstname = $("#firstname").val();
			var lastname = $("#lastname").val();
			var current = $("#current").val();
			var password = $("#password").val();
			var confirm = $("#confirm").val();

			if(current === ""){
				Utils.ShowToast({ message : "Current password is required"});
				$("#current").addClass("error");
			}else if(password === ""){	
				Utils.ShowToast({ message : "New password is required"});
				$("#password").addClass("error");
			}else if(confirm === ""){	
				Utils.ShowToast({ message : "Confirm password is required"});
				$("#confirm").addClass("error");
			}else if(password.length < 8){
				Utils.ShowToast({message : "Password too short (8 characters min)"});
				$("#password").addClass("error");
			}else if(password !== confirm){
				Utils.ShowToast({ message : "New password does not match confirm password"});
				$("#password").addClass("error");
				$("#confirm").addClass("error");
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