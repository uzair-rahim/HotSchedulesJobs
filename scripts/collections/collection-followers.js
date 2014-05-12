define([
	"backbone",
	"utils",
	"scripts/models/model-follower"
	],
	function(Backbone, Utils, ModelFollower){
	'use strict';

	var Followers = Backbone.Collection.extend({
		model : ModelFollower,

		urlRoot : function(){
			return Utils.GetURL("/services/rest/employer");
		},

		url : function(){
			var url = this.urlRoot() + "/"+this.guid+"/followers";
			return url;
		},

		initialize : function(options){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			this.guid = options.guid;
		}

	});

	return Followers;

	}
);