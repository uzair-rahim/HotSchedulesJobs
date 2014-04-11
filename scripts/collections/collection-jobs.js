define([
	"backbone",
	"utils",
	"scripts/models/model-job"
	],
	function(Backbone, Utils, Job){
	"use strict";

	var Jobs = Backbone.Collection.extend({
		model : Job,
		urlRoot : "/brushfire/services/rest/job/list/",

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Jobs collection initialized....");
		},

		url : function(){
			var user= Utils.GetUserSession();
			var url = this.urlRoot + user.employerIds[0];
			return url;
		}
	});

	return Jobs;

	}
);