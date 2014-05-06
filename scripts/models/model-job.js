define([
		"backbone",
		"utils"
	],
	function(Backbone, Utils){
		var Job = Backbone.Model.extend({

			urlRoot : function(){
				return Utils.GetURL("/services/rest/job/");
			},
			
			url : function(){
				var url = this.urlRoot();
				return url;
			},

			initialize : function(){
				console.log("Job model initialized...");
			}

		});

		return Job;
	}
);