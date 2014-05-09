define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
		var Network = Backbone.Model.extend({

			urlRoot : function(){
				return Utils.GetURL("/services/rest/network/");
			},
			
			url : function(){
				var url = this.urlRoot();
				return url;
			},

			initialize : function(){
				console.log("Shared Connection model initialized...");
			}

		});

		return Network;
	}
);