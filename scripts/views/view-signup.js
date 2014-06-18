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
			"click #help-icon"	: "showHelp"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Signup view initialized...");
		},

		signup : function(){
			console.log("Signup...");

			$("input").removeClass("error");

			var vldtRegister = vldt.validate({
				"#firstname"	: "alpha",
				"#lastname"		: "alpha",
				"#emailaddress"	: "email",
				"#password"		: "alphanumeric"
			});

			if(!vldtRegister){

				var errors = vldt.getErrors();
				console.log(vldt.getErrors());

				for(var key in errors){
					if(errors[key] === false){
						$(key).addClass("error");
						switch(key){
							case "#firstname":
								Utils.ShowToast({message : "There are errors in the form..."});
							break;
							case "#lastname":
								Utils.ShowToast({message : "There are errors in the form..."});
							break;	
							case "#emailaddress":
								Utils.ShowToast({message : "There are errors in the form..."});
							break;
							case "#password":
								Utils.ShowToast({message : "There are errors in the form..."});
							break;
						}
					}
				}

				return false;
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
								App.router.navigate("findBusiness", true);
							}
						},
						error : function(){
							Utils.ShowToast({message : "Error processing request"});
						}
					});
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
		
		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewSignup;
});