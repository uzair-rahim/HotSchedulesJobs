define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
		var EmployerType = Backbone.Model.extend({

			defaults : {
				
			},

			urlRoot : function(){
				return Utils.GetURL("/services/rest/employer/types");
			},

			url : function(){
				var url = this.urlRoot();
				return url;
			},
			
			initialize : function(options){
				console.log('Employer Type model initialize...');
			}

		});

		return EmployerType;
	}
);