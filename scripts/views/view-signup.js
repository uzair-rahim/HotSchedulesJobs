define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"vldt",
		"marionette",
		"hbs!templates/template-view-signup",
		"scripts/models/model-user"
	],
	function($, Cookie, App, Utils, Vldt, Marionette, Template, ModelUser){
	"use strict";

	var ViewSignup = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #signup"		: "signup",
			"click #nevermind"	: "nevermind",
			"click #help-icon"	: "showHelp",
			"click .terms span"	: "showTerms"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Signup view initialized...");
		},

		signup : function(){

			var accept = $("#accept");
			var isChecked = $(accept).prop("checked");

			if(!isChecked){
				Utils.ShowToast({message : "You must agree to terms and conditions "});
			}else{
				console.log("Signup...");

				$("input").removeClass("error");

				var vldtRegister = vldt.validate({
					"#firstname"	: "alpha",
					"#lastname"		: "alpha",
					"#emailaddress"	: "email",
					"#password"		: "alphanumeric",
					"#confirm"		: "alphanumeric"
				});

				if(!vldtRegister){

					var errors = vldt.getErrors();
					console.log(vldt.getErrors());

					for(var key in errors){
						if(errors[key] === false){
							$(key).addClass("error");
							switch(key){
								case "#firstname":
									Utils.ShowToast({message : "First name is required"});
								break;
								case "#lastname":
									Utils.ShowToast({message : "Last name is required"});
								break;	
								case "#emailaddress":
									Utils.ShowToast({message : "Email address is required"});
								break;
								case "#password":
									Utils.ShowToast({message : "Password is required"});
								break;
								case "#confirm":
									Utils.ShowToast({message : "Confirm password is required"});
								break;
							}
						}
					}

					return false;
				}else{

					var password = $("#password").val();
					var confirm = $("#confirm").val();

					if(password !== confirm){
						Utils.ShowToast({message : "Password does not match confirm password"});
					}else{

						var that = this;
						var model = new ModelUser();

						var user = new Object();
						user.firstname = $("#firstname").val(),
						user.lastname = $("#lastname").val(),
						user.emailaddress = $("#emailaddress").val(),
						user.password = $("#password").val();

						model.save(user, {
							success : function(response){
								var errorCode = response.get("errorCode");
								if( errorCode === -1){
									console.log("Email Address already exists...");
									Utils.ShowToast({message : "Email Address already exists"});
								}else{
									console.log("User successfuly registered!");
									that.createSession(response);
									App.router.navigate("accountVerification", true);
								}
							},
							error : function(){
								Utils.ShowToast({message : "Error processing request"});
							}
						});

					}
					
				}

			}
		},

		createSession : function(response) {
			var authsession = {
				firstname : response.attributes.firstname,
				lastname : response.attributes.lastname,
				guid : response.attributes.guid
			}
			Utils.CreateUserSession(authsession);
		},

		nevermind : function(){
			console.log("Nevermind...");
			App.router.navigate("login", true);
		},

		showHelp : function(){
			Utils.ShowHelp();
		},

		showTerms : function(event){
			Utils.ShowTermsAndConditions({inApp : false, secondaryButtonText : "Decline"});
			event.preventDefault();
		},
		
		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewSignup;
});