define([
	"backbone",
	"utils",
	"scripts/models/model-shared-connections"
	],
	function(Backbone, Utils, ModelSharedConnections){
	'use strict';

	var SharedConnections = Backbone.Collection.extend({
		model : ModelSharedConnections,

		urlRoot : function(){
			return Utils.GetURL("/services/rest/network/shared");
		},

		url : function(){
			var url = this.urlRoot() + "?user1Guid="+this.guid1+"&user2Guid="+this.guid2;
			console.log(url);
			return url;
		},

		initialize : function(options){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			this.guid1 = options.guid1;
			this.guid2 = options.guid2;
		}

	});

	return SharedConnections;

	}
);