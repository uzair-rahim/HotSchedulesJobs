define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
		var SharedConnections = Backbone.Model.extend({

			urlRoot : function(){
				return Utils.GetURL("/services/rest/network/shared");
			},
			
			url : function(){
				var url = this.urlRoot();
				return url;
			},

			initialize : function(){
				console.log("Shared Connection model initialized...");
			}

		});

		return SharedConnections;
	}
);