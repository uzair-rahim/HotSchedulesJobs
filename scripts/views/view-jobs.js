define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-jobs",
		"scripts/models/model-job"
	],
	function($, Cookie, App, Utils, Marionette, Template, ModelJob){
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
			console.log("Save job...");

			var item = $(event.target).parent().closest("#job-list > li");
			var index = $(item).index();
			var job = this.model.jobs[index];

			var update = new Object();
				update.shifts = new Object();
				update.jobType = new Object();
				update.employer = new Object();
				update.updatedBy = new Object();
				update.createdBy = new Object();

				update.id = job.id;
				update.guid = job.guid;
				update.jobName = $(item).find(".position .custom-select-button").text();
				update.description = $(item).find(".description").val();
				update.wage = $(item).find(".wage").val(); 
				update.wageType = $(item).find(".wage-type .custom-select-button").text().replace("-", "").toUpperCase();

				update.jobType.id = job.jobType.id;
				update.jobType.guid = $(item).find(".position .custom-select-list li:contains('"+update.jobName+"')").attr("id");

				update.employer.id = job.employer.id;
				update.employer.guid = job.employer.guid;

				update.created = job.created;
				update.createdBy = job.createdBy;

				update.updatedBy.id = job.updatedBy.id
				update.updatedBy.guid = Utils.GetUserSession().guid;

				update.shifts = [{id : 0}];

				console.log(update);

				var that = this;
				var model = new ModelJob();				
					model.save(update,{
						type : "PUT",
						headers : {
							'token' : Utils.GetUserSession().brushfireToken
						},
						success : function(){
							console.log("Job successfully saved");
							App.router.controller.jobs();
						},
						error : function(){
							console.log("There was an error trying to save the job");
							Utils.ShowToast({portal : false, type : "error", message : "Error saving job..."});
						}
					});


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
			event.stopPropagation();
			Utils.ShowToast({portal : true, type : "success", message : "Message sent"});
		},

		candidateArchive : function(event){
			event.stopPropagation();
			Utils.ShowToast({portal : false, type : "success", message : "Candidate archived"});
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