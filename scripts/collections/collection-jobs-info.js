define([
	"app",
	"backbone",
	"utils",
	"scripts/models/model-job"
	],
	function(App, Backbone, Utils, Job){
	"use strict";

	var JobsInfo = Backbone.Collection.extend({
		model : Job,

		urlRoot : function(){
			return Utils.GetURL("/services/rest/employer/");
		},
		
		url : function(){
			var url = this.urlRoot() + App.session.getEmployerGUID() + "/jobpostingsinfo";
			return url;
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Jobs Info collection initialized....");
		}

	});

	return JobsInfo;

	}
);