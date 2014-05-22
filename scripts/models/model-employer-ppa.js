define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
		var EmployerPPA = Backbone.Model.extend({

			defaults : {
				
			},

			urlRoot : function(){
				return Utils.GetURL("/services/rest/employer/ppatypes");
			},

			url : function(){
				var url = this.urlRoot();
				return url;
			},
			
			initialize : function(options){
				console.log('Employer PPA model initialize...');
			}

		});

		return EmployerPPA;
	}
);