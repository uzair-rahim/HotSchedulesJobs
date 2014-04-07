define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-jobs"
	],
	function($, Cookie, App, Utils, Marionette, Template){
	"use strict";

	var ViewJobs = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #add-new-job"	: "addNewJob",
			"click #job-list > li"	: "expandJob",
			"click .edit-job"		: "editJob",
			"click #candidates" 	: "candidates",
			"click #profile"		: "profile"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Jobs view initialized...");
		},

		addNewJob : function(){
			alert("Add New Job");
		},

		editJob : function(event){
			alert("Edit Job");
			event.stopPropagation();
		},

		expandJob : function(event){
			var item = $(event.target).closest("#job-list li");

			if($(item).hasClass("expanded")){
				$("#job-list > li").removeClass("expanded");
			}else{
				$("#job-list > li").removeClass("expanded");
				$(item).addClass("expanded");
			}
			
		},

		candidates : function(){
			App.router.navigate("candidates/job", true);
		},

		profile : function(){
			App.router.navigate("profile/jobs/jobs", true);
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewJobs;
});