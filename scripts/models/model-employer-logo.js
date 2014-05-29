define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
		var EmployerLogo = Backbone.Model.extend({

			defaults : {
				
			},

			urlRoot : function(){
				return Utils.GetURL("/services/rest/employer/logo");
			},

			url : function(){
				var url = this.urlRoot() + "/" + this.guid;
				return url;
			},

			initialize : function(options){
				this.guid = options.guid;
				console.log('Employer Logo model initialized...');
			}

		});

		return EmployerLogo;
	}
);