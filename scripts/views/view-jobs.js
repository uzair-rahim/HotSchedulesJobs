define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-jobs",
		"scripts/models/model-job",
		"scripts/models/model-candidate"
	],
	function($, Cookie, App, Utils, Marionette, Template, ModelJob, ModelCandidate){
	"use strict";

	var ViewJobs = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		numberOfCalls : 0,
		template: Template,
		events : {
			"click #add-new-job"			: "addNewJob",
			"click #cancel-add"				: "cancelAddJob",
			"click #save-add"				: "saveAddJob",
			"click #job-list > li"			: "expandJob",
			"click #archive-candidates"		: "archiveCandidates",
			"click .edit-job"				: "editJob",
			"click .save-job"				: "saveJob",
			"click .cancel-edit"			: "cancelEdit",
			"click .posted"					: "posted",
			"click .view-candidates" 		: "candidates",
			"click .view-profile"			: "profile",
			"click .candidate-select"		: "candidateSelect",
			"click .candidate-message"		: "candidateMessage",
			"click .candidate-archive"		: "candidateArchive",
			"click .candidate-network"		: "candidateNetwork"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Jobs view initialized...");
		},

		addNewJob : function(){
			$(".candidate-select").prop("checked", false);
			$("#archive-candidates").css("display", "none");

			$("#add-job").addClass("show");

			var jobs = $("#job-list > li");
			var cadndidates = $(".grid-list.sub");
			var profiles = $(".hourly-profile");
			var edits = $(".edit-mode");

			$(jobs).removeClass("expanded").removeClass("faded");

			$(cadndidates).removeClass("show");
			$(profiles).removeClass("show");
			$(edits).removeClass("show");

		},

		cancelAddJob : function(){
			$("#add-job").removeClass("show");
		},

		saveAddJob : function(){

			var wage = $("#new-wage").val();

			if(wage === "" || isNaN(wage)){
				Utils.ShowToast({message : "Invalid wage..."});
			}else{
				var job = new Object();	
					job.shifts = new Object();
					job.jobType = new Object();
					job.employer = new Object();
					job.updatedBy = new Object();
					job.createdBy = new Object();

					job.id = 0;
					job.jobType.id = 0;
					job.employer.id = 0;
					job.updatedBy.id = 0;
					job.createdBy.id = 0;
					job.shifts = [{id : 0}];
					job.updatedBy.guid = Utils.GetUserSession().guid;
					job.createdBy.guid = Utils.GetUserSession().guid;
					job.employer.guid = Utils.GetUserSession().employerIds[0];

					job.jobName = $("#new-position button").text();
					job.description = $("#new-description").val();
					job.wage = wage; 
					job.wageType = $("#new-wage-type .custom-select-button").text().replace("-", "").toUpperCase();
					job.jobType.guid = $("#new-position .custom-select-list li:contains('"+job.jobName+"')").attr("id");

				var that = this;
				var model = new ModelJob();				
					model.save(job,{
						type : "POST",
						success : function(){
							console.log("Job successfully saved");
							App.router.controller.jobs();
						},
						error : function(){
							console.log("There was an error trying to save the job");
							Utils.ShowToast({ message : "Error saving job..."});
						}
					});

			}

			

		},

		editJob : function(event){

			var add = $("#add-job");
			var isAddJobExpanded = $("#add-job").hasClass("show");
			var all = $("#job-list > li");
			var allListItems = $("#job-list li");
			var allEdits = $("#job-list > li .edit-mode");
			var allCandidates = $("#job-list > li .grid-list.sub")
			var li = $(event.target).closest("#job-list > li");
			var edit = $(li).find(".edit-mode");
			var candidates = $(li).find(".grid-list.sub");
			var profile = $(".hourly-profile");

			$(".candidate-select").prop("checked", false);
			$("#archive-candidates").css("display", "none");

			$(add).removeClass("show");

			var isEditExpanded = $(edit).hasClass("show");
			var isCandidatesListExpanded = $(candidates).hasClass("show");

			//if(!isAddJobExpanded){
				//if(!isCandidatesListExpanded){

					$(all).removeClass("expanded");
					$(all).addClass("faded");
					$(allListItems).removeClass("expanded");
					$(allListItems).removeClass("faded");
					$(allEdits).removeClass("show");
					$(allCandidates).removeClass("show");
					$(profile).removeClass("show");

					if(!isEditExpanded){
						$(edit).addClass("show");
						$(li).removeClass("faded");
						$(li).addClass("expanded");
					}else{
						$(edit).removeClass("show");
						$(li).removeClass("expanded");
						$(all).removeClass("faded");
					}
				//}
			//}

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

			var wage = $(item).find(".wage").val();

			if(wage === "" || isNaN(wage)){
				Utils.ShowToast({message : "Invalid wage..."});
			}else{

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
					update.wage = wage
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

					var that = this;
					var model = new ModelJob();				
						model.save(update,{
							type : "PUT",
							success : function(){
								console.log("Job successfully saved");
								App.router.controller.jobs();
							},
							error : function(){
								console.log("There was an error trying to save the job");
								Utils.ShowToast({ message : "Error saving job..."});
							}
						});	

			} 

			event.stopPropagation();
		},

		posted : function(event){
			alert("Posted");
			event.stopPropagation();
		},

		expandJob : function(event){
			var add = $("#add-job");
			var isAddJobExpanded = $("#add-job").hasClass("show");
			var all = $("#job-list > li");
			var allListItems = $("#job-list li");
			var allEdits = $("#job-list > li .edit-mode");
			var allCandidates = $("#job-list > li .grid-list.sub");
			var li = $(event.target).closest("#job-list > li");
			var edit = $(li).find(".edit-mode");
			var candidates = $(li).find(".grid-list.sub");
			var allProfiles = $(li).find(".hourly-profile");

			
			$(".candidate-select").prop("checked", false);
			$("#archive-candidates").css("display", "none");

			$(add).removeClass("show");

			var isEditExpanded = $(edit).hasClass("show");
			var isCandidatesListExpanded = $(candidates).hasClass("show");

			//if(!isAddJobExpanded){
				if(!isEditExpanded){

					$(all).removeClass("expanded");
					$(allListItems).removeClass("expanded");
					$(allListItems).removeClass("faded");
					$(all).addClass("faded");
					$(allEdits).removeClass("show");
					$(allCandidates).removeClass("show");
					$(allProfiles).removeClass("show");


					if(!isCandidatesListExpanded){
						$(candidates).addClass("show");
						$(li).addClass("expanded");
					}else{
						$(candidates).removeClass("show");
						$(li).removeClass("expanded");
						$(all).removeClass("faded");
					}
				}
			//}

		},

		candidates : function(event){
			event.stopPropagation();
			var guid = $(event.target).attr("id");
			App.router.navigate("candidates/job/"+guid, true);
		},

		profile : function(event){

			var item = $(event.target).closest(".view-profile");
			var job = $(item).closest("#job-list > li");
			var candidatesList = $(job).find(".candidates-list");
			var isNewCandidate = $(item).find(".candidate-name").hasClass("new");
			var candidateGuid = $(item).attr("id");
			var allItems = $("#candidates-list > li");
			var profile = $(item).find(".hourly-profile");
			var isProfileExpanded = $(profile).hasClass("show");
			var allProfiles = $(".hourly-profile");

			$(allItems).removeClass("expanded");
			$(allItems).addClass("faded");
			$(allProfiles).removeClass("show");

			if(!isProfileExpanded){
				$(item).addClass("expanded");	
				$(item).removeClass("faded");	
				$(profile).addClass("show");

				if(isNewCandidate){
					$(item).find("*").removeClass("new");

					$(job).find(".candidates-list li:eq("+$(item).index()+")").removeClass("new");

					var request = new Object();
					var update = new Object();

					request.type = "update";
					request.jobGuid = $(job).attr("data-guid");
					request.guid = $(item).attr("data-guid");

					update.id = $(item).attr("data-id");;
					update.seen = true;

					var candidate = new ModelCandidate(request);

						candidate.save(update, {
							success : function(){
								console.log("Candidate successfully marked as seen...");

								if(!$(candidatesList).find("*").hasClass("new")){
									$(job).find("*").removeClass("new")
								}

							},
							error : function(){
								console.log("There was an error trying to mark the cadndidates as seen");
								Utils.ShowToast({ message : "Unexpected error occured"});
							}
						});

				}

			}else{
				$(item).removeClass("expanded");
				$(allItems).removeClass("faded");	
				$(allProfiles).removeClass("show");
			}

			event.stopPropagation();
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
			Utils.ShowToast({ message : "Message sent"});
		},

		candidateArchive : function(event){

			var candidate = $(event.target).closest(".view-profile");
			var job = $(candidate).closest("#job-list > li");

			var request = new Object();
			var update = new Object();

				request.type = "update";
				request.jobGuid = $(job).attr("data-guid");
				request.guid = $(candidate).attr("data-guid");

				update.id = $(candidate).attr("data-id");;
				update.archived = true;

				var candidate = new ModelCandidate(request);

					candidate.save(update, {
						success : function(){
							console.log("Candidate successfully marked as archived...");
							App.router.controller.jobs();
						},
						error : function(){
							console.log("There was an error trying to mark the cadndidates as archived");
							Utils.ShowToast({ message : "Unexpected error occured"});
						}
					});

			event.stopPropagation();
		},

		candidateNetwork : function(event){
			App.router.navigate("connections/23", true);
			event.stopPropagation();
		},

		archiveCandidates : function(){
			this.numberOfCalls = $(".candidate-select:checked").length;
			this.bulkArchive();
		},

		bulkArchive : function(){
			if(this.numberOfCalls > 0){
				var that = this;
				var element = $(".candidate-select[type='checkbox']:checked:eq("+(this.numberOfCalls-1)+")");
				var job = $(element).closest("#job-list > li");

				var jobGuid = $(job).attr("data-guid");
				var id =  $(job).attr("data-id");
				var guid =  $(element).closest(".view-profile").attr("data-guid");

				var request = new Object();
					request.type = "update";
					request.jobGuid = jobGuid;
					request.guid = guid;

				var update = new Object();
					update.id = id;	
					update.archived = true;

				var candidate = new ModelCandidate(request);

					candidate.save(update, {
						success : function(){
							console.log("Candidate successfully marked as archived...");
							that.numberOfCalls--;
							that.bulkArchive();
						},
						error : function(){
							console.log("There was an error trying to mark the cadndidates as archived");
							Utils.ShowToast({ message : "Unexpected error occured"});
						}
					});	

			}else{
				Backbone.history.loadUrl();
			}
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