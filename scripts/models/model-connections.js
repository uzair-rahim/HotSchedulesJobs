define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
		var Connections = Backbone.Model.extend({

			urlRoot : function(){
				return Utils.GetURL("/services/rest/network");
			},
			
			url : function(){
				var url = this.urlRoot()+"/"+this.userGUID+"/jobPosting/"+this.jobGUID;
				return url;
			},

			initialize : function(options){
				this.jobGUID = options.jobGUID;
				this.userGUID = options.userGUID;
				console.log("Connections model initialized...");
			}

		});

		return Connections;
	}
);