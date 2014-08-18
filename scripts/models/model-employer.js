define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
		var Employer = Backbone.Model.extend({

			defaults : {
				id 		: null,
				guid 	: null
			},

			initialize : function(){
				console.log("Employer model initialize...");
			},

			url : function(){
				var url = this.urlRoot();
				return url;
			},

			urlRoot : function(){
				return Utils.GetURL("/services/rest/employer");
			}

		});

		return Employer;
	}
);