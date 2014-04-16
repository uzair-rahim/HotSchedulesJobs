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
			"click .save-job"			: "saveJob",
			"click .cancel-edit"		: "cancelEdit",
			"click .posted"				: "posted",
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
			var all = $("#job-list > li");
			var allEdits = $("#job-list > li .edit-mode");
			var allCandidates = $("#job-list > li .grid-list.sub")
			var li = $(event.target).closest("#job-list > li");
			var edit = $(li).find(".edit-mode");
			var candidates = $(li).find(".grid-list.sub");

			var isEditExpanded = $(edit).hasClass("show");
			var isCandidatesListExpanded = $(candidates).hasClass("show");

			if(!isCandidatesListExpanded){

				$(all).removeClass("expanded");
				$(all).addClass("faded");
				$(allEdits).removeClass("show");
				$(allCandidates).removeClass("show");

				if(!isEditExpanded){
					$(edit).addClass("show");
					$(li).addClass("expanded");
				}else{
					$(edit).removeClass("show");
					$(li).removeClass("expanded");
					$(all).removeClass("faded");
				}
			}

			event.stopPropagation();
		},

		cancelEdit : function(event){
			
			var all = $("#job-list > li");
			var allEdits = $("#job-list > li .edit-mode");

			$(all).removeClass("expanded");
			$(all).removeClass("faded");
			$(allEdits).removeClass("show");

			event.stopPropagation();
		},

		saveJob : function(event){
			var all = $("#job-list > li");
			var allEdits = $("#job-list > li .edit-mode");

			$(all).removeClass("expanded");
			$(all).removeClass("faded");
			$(allEdits).removeClass("show");

			event.stopPropagation();
		},

		posted : function(event){
			alert("Posted");
			event.stopPropagation();
		},

		expandJob : function(event){
			var all = $("#job-list > li");
			var allEdits = $("#job-list > li .edit-mode");
			var allCandidates = $("#job-list > li .grid-list.sub");
			var li = $(event.target).closest("#job-list > li");
			var edit = $(li).find(".edit-mode");
			var candidates = $(li).find(".grid-list.sub");

			var isEditExpanded = $(edit).hasClass("show");
			var isCandidatesListExpanded = $(candidates).hasClass("show");

			if(!isEditExpanded){

				$(all).removeClass("expanded");
				$(all).addClass("faded");
				$(allEdits).removeClass("show");
				$(allCandidates).removeClass("show");

				if(!isCandidatesListExpanded){
					$(candidates).addClass("show");
					$(li).addClass("expanded");
				}else{
					$(candidates).removeClass("show");
					$(li).removeClass("expanded");
					$(all).removeClass("faded");
				}
			}

		},

		candidates : function(event){
			event.stopPropagation();
			var guid = $(event.target).attr("id");
			App.router.navigate("candidates/job/"+guid, true);
		},

		profile : function(event){
			event.stopPropagation();
			//App.router.navigate("profile/jobs/jobs", true);
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
				jsonObject.jobtypes = this.model.jobtypes;
				jsonObject.jobs = this.model.jobs;
				jsonObject.breadcrumb = App.getTrail();
			return jsonObject;
		}
		
	});

	return ViewJobs;
});