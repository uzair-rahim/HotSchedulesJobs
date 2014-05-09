define([
	"backbone",
	"utils",
	"scripts/models/model-network"
	],
	function(Backbone, Utils, ModelNetwork){
	'use strict';

	var Network = Backbone.Collection.extend({
		model : ModelNetwork,

		urlRoot : function(){
			return Utils.GetURL("/services/rest/network");
		},

		url : function(){
			var url = this.urlRoot() + "/"+this.guid;
			return url;
		},

		initialize : function(options){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			this.guid = options.guid;
		}

	});

	return Network;

	}
);