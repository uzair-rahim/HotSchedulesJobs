define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
		var Authenticate = Backbone.Model.extend({

			defaults : {
				emailaddress : null,
				password : null
			},

			urlRoot : function(){
				return Utils.GetURL("/services/rest/auth/login");
			},

			url : function(){
				var url = this.urlRoot();
				return url;
			},

			initialize : function(options){
				console.log("Authenticate model initialized...");
			}

		});

		return Authenticate;
	}
);