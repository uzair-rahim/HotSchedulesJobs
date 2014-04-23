define([
		"backbone",
		"utils"
	],
	function(Backbone, Utils){
		var Job = Backbone.Model.extend({

			urlRoot : function(){
				return Utils.GetURL("/services/rest/job/");
			},
			
			initialize : function(){
				console.log("Job model initialized...");
			},

			url : function(){
				var url = this.urlRoot();
				return url;
			}

		});

		return Job;
	}
);