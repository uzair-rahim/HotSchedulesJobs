define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
		var DeleteEmployerAdmin = Backbone.Model.extend({

			defaults : {
				
			},

			urlRoot : function(){
				return Utils.GetURL("/services/rest/employer");
			},

			url : function(){
				var url = this.urlRoot() + "/"+this.guid+"/admins/"+this.admin;
				return url;
			},
			
			initialize : function(options){
				this.guid = options.guid;
				this.admin = options.admin;
				console.log('Delete Employer Admin model initialized...');
			}

		});

		return DeleteEmployerAdmin;
	}
);