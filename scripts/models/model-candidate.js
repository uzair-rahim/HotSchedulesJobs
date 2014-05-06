define([
		"backbone",
		"utils"
	],
	function(Backbone, Utils){
		var Candidate = Backbone.Model.extend({

			urlRoot : function(){
				return Utils.GetURL("/services/rest/job/");
			},
			
			url : function(){
				var url = this.urlRoot();

				if(this.attributes.type == "update"){
					url += this.attributes.jobGuid + "/candidates/" + this.attributes.guid
				}

				return url;
			},

			initialize : function(){
				console.log("Candidate model initialized...");
			}

		});

		return Candidate;
	}
);