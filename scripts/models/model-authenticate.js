define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
		var Authenticate = Backbone.Model.extend({

			urlRoot : function(){
				return Utils.GetURL("/services/rest/auth/login");
			},

			url : function(){
				var url = this.urlRoot() + "/" + this.email + "/" + this.password;
				return url;
			},

			initialize : function(options){
				console.log("Authenticate model initialized...");
				this.email = options.email;
				this.password = options.password;
			}

		});

		return Authenticate;
	}
);