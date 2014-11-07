define([
		"jquery",
		"analytics",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-jobs",
		"scripts/views/view-job-row"
	],
	function($, Analytics, App, Utils, Marionette, Template, JobRow){
	"use strict";

	var ViewJobs = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Jobs view initialized...");
		},

		onShow : function(){
			ga('create', 'UA-52257201-1', 'hotschedulespost.com');
      		ga('send', 'pageview', '/jobs');
      		
      		var jobs = this.model.jobs;
      		var types = this.model.types;

      		var container = $(this.el).find("#job-list");
      		$.each(jobs, function(){
      			var data = new Object();
      				data.job = this;
      				data.types = types;
      			var row = new JobRow({model : data});
      			container.append(row.render().el);
      		});

		},

		serializeData : function(){
			var jsonObject = new Object();
			return jsonObject;
		}
		
	});

	return ViewJobs;
});