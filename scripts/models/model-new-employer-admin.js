define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
		var NewEmployerAdmin = Backbone.Model.extend({

			defaults : {
				
			},

			urlRoot : function(){
				return Utils.GetURL("/services/rest/employer");
			},

			url : function(){
				var url = this.urlRoot() + "/"+this.guid+"/admins";
				return url;
			},
			
			initialize : function(options){
				this.guid = options.guid;
				console.log('New Employer Admin model initialize...');
			}

		});

		return NewEmployerAdmin;
	}
);