define([
	"app",
	"backbone",
	"utils",
	"scripts/models/model-job"
	],
	function(App, Backbone, Utils, Job){
	"use strict";

	var Jobs = Backbone.Collection.extend({
		model : Job,

		urlRoot : function(){
			return Utils.GetURL("/services/rest/job/");
		},
		
		url : function(){
			var url = this.urlRoot() + "list/" + App.router.controller.getEmployerGUID();
			return url;
		},

		initialize : function(options){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Jobs collection initialized....");
		}

	});

	return Jobs;

	}
);