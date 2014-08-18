define([
	"backbone",
	"utils",
	"scripts/models/model-employer"
	],
	function(Backbone, Utils, Employer){
	"use strict";

	var Employers = Backbone.Collection.extend({
		model : Employer,

		urlRoot : function(){
			return Utils.GetURL("/services/rest/employer");
		},
		
		url : function(){
			var url = this.urlRoot();
			return url;
		},

		initialize : function(options){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Employers collection initialized....");
		}

	});

	return Employers;

	}
);