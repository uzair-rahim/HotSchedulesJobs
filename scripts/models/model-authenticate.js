define([
		"backbone",
		"utils"
	],
	function(Backbone, Utils){
		var Authenticate = Backbone.Model.extend({

			defaults : {
				emailaddress : null,
				password 	 : null
			},

			initialize : function(options){
				console.log("Authenticate model initialized...");
			},

			urlRoot : function(){
				return Utils.GetURL("/services/rest/auth/login");
			},

			url : function(){
				var url = this.urlRoot();
				return url;
			},

			validate : function(attributes){
				var errors = [];
				var emailRegExp = Utils.RegularExpressions.email;

				if(attributes.emailaddress === "" || attributes.password === ""){
					errors.push({ error : "required", message : "Email address and password are required"});
				}

				if(!emailRegExp.test(attributes.emailaddress)){
					errors.push({ error : "email", message : "Invalid email address"});
				}

				return errors.length ? errors : false;

			},

			getUser : function(){
				var data = this.attributes;

				if(data.errorCode === 0){
					var user = new Object();
						user.guid = data.guid;
						user.verified = data.verified;
						user.firstname = data.firstname;
						user.lastname = data.lastname;
						user.photo = data.photo;
						user.email = data.email;
						user.employers = data.employerIds;
						user.roles = data.roles;
						return user;
				}

				return false;
			},

		});

		return Authenticate;
	}
);