define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
		var SupportSearch = Backbone.Model.extend({

			urlRoot : function(){
				return Utils.GetURL("/services/rest/search/");
			},
			
			url : function(){
				var url = this.urlRoot();
				return url;
			},

			initialize : function(){
				console.log("Support Search model initialized...");
			}

		});

		return SupportSearch;
	}
);