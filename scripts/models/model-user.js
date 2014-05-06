define([
	"backbone"
	],
	function(Backbone){
		var User = Backbone.Model.extend({

			defaults : {
				firstname	: null,
				lastname 	: null,
				emailaddress: null,
				password 	: null
			},

			urlRoot : function(){
				return Utils.GetURL("/services/rest/registration/registerUser");
			},

			url : function(){
				var url = this.urlRoot();
				return url;
			},

			initialize : function(){
				console.log('User model initialize...')
			}

		});

		return User;
	}
);