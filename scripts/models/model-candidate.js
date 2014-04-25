define([
		"backbone",
		"utils"
	],
	function(Backbone, Utils){
		var Candidate = Backbone.Model.extend({

			urlRoot : function(){
				return Utils.GetURL("/services/rest/job/");
			},
			
			initialize : function(){
				console.log("Candidate model initialized...");
			},

			url : function(){
				var url = this.urlRoot();

				if(this.attributes.type == "update"){
					url += this.attributes.jobGuid + "/candidates/" + this.attributes.guid
				}

				return url;
			}

		});

		return Candidate;
	}
);