define([
		"jquery",
		"jquerycookie",
		"analytics",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-reset-password"
	],
	function($, Cookie, Analytics, App, Utils, Marionette, Template){
	"use strict";

	var ViewResetPassword = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		userGUID : null,
		template: Template,
		events : {
			"click #submit"		: "submit",
			"click #help-icon"	: "showHelp",
			"click #return"		: "returnToLogin"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Reset Password view initialized...");
		},

		onShow : function(){
			ga('create', 'UA-52257201-1', 'hotschedulespost.com');
      		ga('send', 'pageview', '/reset-password');

			$("#confirmpassword").keyup(function(event){
				if(event.keyCode == 13){
					$("#submit").click();
				}
			});

			var url = window.location.href;
			var indexOfID = url.indexOf("?id=");
			var id = url.substring(indexOfID+4); 

			this.userGUID = id;
			
		},

		submit : function(){
			var password = $("#password").val();
			var confirm = $("#confirm").val();

			if(password === ""){
				Utils.ShowToast({message : "New password is required"});
			}else if(confirm === ""){
				Utils.ShowToast({message : "Confirm password is required"});
			}else if(password !== confirm){
				Utils.ShowToast({message : "New password does not match the confirm password"});
			}else if(password.length < 8){
				Utils.ShowToast({message : "Password too short (8 characters min)"});
			}else{
				var that = this;
				var restURL = Utils.GetURL("/services/rest/public/resetPassword/");

				$.ajax({
					url : restURL+that.userGUID,
					data: '{"password" : "' + confirm + '"}',
					type : "PUT",
					dataType: "json",
					contentType: "application/json",
	    			processData: false,
	    			success : function(response){
	    				Utils.ShowToast({message : "Password successfully saved"});
	    				setTimeout(function(){
							window.location.href = "index.jsp";
	    				},3000)
	    			},
	    			error : function(response){
	    				Utils.ShowToast({message : "Error resetting password"});
	    				$("#password").val("");
						$("#confirm").val("");
	    			}
				});

			}

		},

		returnToLogin : function(){
			window.location.href = "index.jsp";
		},

		showHelp : function(){
			Utils.ShowHelp();
		},
		
		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewResetPassword;
});