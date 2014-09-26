define([
		"jquery",
		"jquerycookie",
		"analytics",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-forgot-password"
	],
	function($, Cookie, Analytics, App, Utils, Marionette, Template){
	"use strict";

	var ViewForgotPassword = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #submit"		: "submit",
			"click #return"		: "returnToLogin",
			"click #help-icon"	: "showHelp"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Forgot Password view initialized...");
		},

		onShow : function(){
			ga('create', 'UA-52257201-1', 'hotschedulespost.com');
      		ga('send', 'pageview', '/forgot-password');
      		
			$("#emailaddress").keyup(function(event){
				if(event.keyCode == 13){
					$("#submit").click();
				}
			});
		},

		submit : function(){
			$("input").removeClass("error");

			var vldtRegister = vldt.validate({
				"#emailaddress"	: "email",
			});

			if(!vldtRegister){

				var errors = vldt.getErrors();
				console.log(vldt.getErrors());

				for(var key in errors){
					if(errors[key] === false){
						$(key).addClass("error");
						switch(key){
							case "#emailaddress":
								Utils.ShowToast({message : "Invalid email format"});
							break;
						}
					}
				}

				return false;
			}else{
				var email = $("#emailaddress").val();
				var restURL = Utils.GetURL("/services/rest/public/initiateResetPassword/");

				$.ajax({
					url : restURL + email,
					type : "PUT",
					success : function(response){
						$("#emailaddress").val("");
						Utils.ShowToast({message : "Email sent with password reset instructions"});
					},
					error : function(response){
						if(response.status === 404){
							$("#emailaddress").val("");
							Utils.ShowToast({message : "Email sent with password reset instructions"});
						}	
					}
				});
				
			}
		},

		returnToLogin : function(){
			App.router.navigate("login", true);
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

	return ViewForgotPassword;
});