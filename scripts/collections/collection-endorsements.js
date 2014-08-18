define([
	"backbone",
	"utils",
	"scripts/models/model-endorsement"
	],
	function(Backbone, Utils, ModelEndorsement){
	'use strict';

	var Endorsements = Backbone.Collection.extend({
		model : ModelEndorsement,

		urlRoot : function(){
			return Utils.GetURL("/services/rest/employer");
		},

		url : function(){
			var url = this.urlRoot() + "/"+this.guid+"/endorsements";
			return url;
		},

		initialize : function(options){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			this.guid = options.guid;
		}

	});

	return Endorsements;

	}
);