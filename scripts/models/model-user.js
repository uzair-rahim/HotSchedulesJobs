define([
	"backbone"
	],
	function(Backbone){
		var User = Backbone.Model.extend({
			url : '/brushfire/services/rest/registration/registerUser',
			defaults : {
				firstname	: null,
				lastname 	: null,
				emailaddress: null,
				password 	: null
			},
			initialize : function(){
				console.log('User model initialize...')
			}

		});

		return User;
	}
);