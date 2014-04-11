define([
	"backbone"
	],
	function(Backbone){
		var Job = Backbone.Model.extend({
			urlRoot : "/brushfire/services/rest/job/",
			
			initialize : function(){
				console.log("Job model initialized...");
			},

			url : function(){
				var url = this.urlRoot;
				return url;
			}

		});

		return Job;
	}
);