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
			"click #add-new-job"		: "addNewJob",
			"click #job-list > li"		: "expandJob",
			"click .edit-job"			: "editJob",
			"click .view-candidates" 	: "candidates",
			"click .view-profile"		: "profile",
			"click .candidate-select"	: "candidateSelect",
			"click .candidate-message"	: "candidateMessage",
			"click .candidate-archive"	: "candidateArchive"
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
			var item = $(event.target).closest("#job-list > li");
			
			$(".candidate-select").prop("checked", false);
			$("#archive-candidates").css("display", "none");

			if($(item).hasClass("expanded")){
				$("#job-list > li").removeClass("expanded");
				$("#job-list > li").removeClass("faded");
			}else{
				$("#job-list > li").removeClass("expanded");
				$("#job-list > li").addClass("faded");
				$(item).addClass("expanded");
			}
			
		},

		candidates : function(event){
			event.stopPropagation();
			App.router.navigate("candidates/job", true);
		},

		profile : function(event){
			event.stopPropagation();
			App.router.navigate("profile/jobs/jobs", true);
		},

		candidateSelect : function(event){
			var count = $(".candidate-select:checked").length;
			if(count > 0){
				$("#archive-candidates").css("display", "block");
			}else{
				$("#archive-candidates").css("display", "none");
			}
			event.stopPropagation();
		},

		candidateMessage : function(event){
			alert("Send Message");
			event.stopPropagation();
		},

		candidateArchive : function(event){
			alert("Archive Candidate");
			event.stopPropagation();
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
				jsonObject.breadcrumb = App.getTrail();
			return jsonObject;
		}
		
	});

	return ViewJobs;
});