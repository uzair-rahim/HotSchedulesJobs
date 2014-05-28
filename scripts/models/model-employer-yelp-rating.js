define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
		var EmployerYelpRating = Backbone.Model.extend({

			defaults : {
				
			},

			urlRoot : function(){
				return Utils.GetURL("/services/rest/employer");
			},

			url : function(){
				var url = this.urlRoot() + "/"+this.guid+"/yelp-rating";
				return url;
			},
			
			initialize : function(options){
				this.guid = options.guid;
				console.log('Employer Yelp Rating model initialize...');
			}

		});

		return EmployerYelpRating;
	}
);