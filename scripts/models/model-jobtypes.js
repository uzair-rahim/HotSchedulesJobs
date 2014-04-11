define([
		"backbone"
	],
	function(Backbone){
		var JobTypes = Backbone.Model.extend({

			urlRoot : "/brushfire/services/rest/jobtypes",
			language: "en",

			initialize : function(){
				console.log("Job Types model initialized...");
			},
			
			url : function(){
				var url = this.urlRoot;
				return url;
			}

		});

		return JobTypes;
	}
);