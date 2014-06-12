define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-job"
	],
	function($, Cookie, App, Utils, Marionette, Template){
	"use strict";

	var ViewJob = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #app-store": "jobPostingMobileAction"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Job view initialized...");
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.job = this.model;
				jsonObject.language = App.Language;
			return jsonObject;
		},
		
		jobPostingMobileAction : function(){
	    	setTimeout(function () {
	    	    window.location = "https://itunes.apple.com/us/app/hotschedules/id294934058";
	    	}, 2000);
	    	var jobpostingguid = $.cookie("job-posting-guid");
	    	var jobpostingempguid = $.cookie("job-posting-emp-guid");
	    	window.location = "hotschedulespost://?jobpostingguid="+jobpostingguid+"&jobpostingempguid="+jobpostingempguid;
		}
		
	});

	return ViewJob;
});