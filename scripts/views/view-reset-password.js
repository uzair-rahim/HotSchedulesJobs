define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-reset-password"
	],
	function($, Cookie, App, Utils, Marionette, Template){
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
				Utils.ShowToast({message : "Password does not match the confirm password"});
			}else{
				var that = this;
				var restURL = Utils.GetURL("/services/rest/public/resetPassword/");

				$.ajax({
					url : restURL+that.userGUID+"/"+confirm,
					type : "PUT",
					dataType: "text",
					contentType: false,
	    			processData: false,
	    			success : function(response){
	    				Utils.ShowToast({message : "Password successfully saved"});
	    				setTimeout(function(){
							window.location.href = "index.jsp";
	    				},3000)
	    			},
	    			error : function(response){
	    				console.log(response);
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