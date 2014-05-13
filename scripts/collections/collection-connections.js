define([
	"backbone",
	"utils",
	"scripts/models/model-network"
	],
	function(Backbone, Utils, ModelNetwork){
	'use strict';

	var Connections = Backbone.Collection.extend({
		model : ModelNetwork,

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