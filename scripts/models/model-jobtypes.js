define([
		"backbone",
		"utils"
	],
	function(Backbone, Utils){
		var JobTypes = Backbone.Model.extend({

			urlRoot : function(){
				return Utils.GetURL("/services/rest/jobtypes");
			},
			
			url : function(){
				var url = this.urlRoot();
				return url;
			},

			initialize : function(){
				console.log("Job Types model initialized...");
			}
			
		});

		return JobTypes;
	}
);