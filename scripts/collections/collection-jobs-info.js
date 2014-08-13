define([
	"backbone",
	"utils",
	"scripts/models/model-job"
	],
	function(Backbone, Utils, Job){
	"use strict";

	var JobsInfo = Backbone.Collection.extend({
		model : Job,

		urlRoot : function(){
			return Utils.GetURL("/services/rest/employer/");
		},
		
		url : function(){
			var user= Utils.GetUserSession();
			var index = Utils.GetSelectedEmployer();
			var url = this.urlRoot() + user.employerIds[index] + "/jobpostingsinfo";
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