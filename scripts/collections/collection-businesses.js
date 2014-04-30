define([
	"backbone",
	"utils",
	"scripts/models/model-business"
	],
	function(Backbone, Utils, Business){
	'use strict';

	var Businesses = Backbone.Collection.extend({
		model : Business,
		urlRoot : "/brushfire/services/rest/search/address",
		initialize : function(options){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			this.name = options.name;
			this.address = options.address;
		},
		url : function(){
			var url = this.urlRoot + "/"+this.name+"/"+this.address+"/5";
			return url;
		}
	});

	return Businesses;

	}
);