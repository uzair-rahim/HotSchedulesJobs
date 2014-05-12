define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
		var Follower = Backbone.Model.extend({

			urlRoot : function(){
				return Utils.GetURL("/services/rest/employer/");
			},
			
			url : function(){
				var url = this.urlRoot();
				return url;
			},

			initialize : function(){
				console.log("Follower model initialized...");
			}

		});

		return Follower;
	}
);