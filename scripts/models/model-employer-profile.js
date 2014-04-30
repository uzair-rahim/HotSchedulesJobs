define([
	'backbone'
	],
	function(Backbone){
		var EmployerProfile = Backbone.Model.extend({
			urlRoot : '/brushfire/services/rest/employer',
			defaults : {
				
			},
			url : function(){
				var url = this.urlRoot + "/"+this.guid;
				return url;
			},
			initialize : function(options){
				this.guid = options.guid;
				console.log('Employer Profile model initialize...');
			}

		});

		return EmployerProfile;
	}
);