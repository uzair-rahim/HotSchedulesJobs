define([
		"backbone"
	],
	function(Backbone){
		var Authenticate = Backbone.Model.extend({

			urlRoot : "/brushfire/services/rest/auth/login",

			initialize : function(options){
				console.log("Authenticate model initialized...");
				this.email = options.email;
				this.password = options.password;
			},
			
			url : function(){
				var url = this.urlRoot + "/" + this.email + "/" + this.password;
				return url;
			}

		});

		return Authenticate;
	}
);