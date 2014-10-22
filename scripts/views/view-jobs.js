define([
		"jquery",
		"jquerycookie",
		"analytics",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-jobs",
		"scripts/models/model-user",
		"scripts/models/model-network",
		"scripts/models/model-job",
		"scripts/models/model-candidate",
		"scripts/models/model-referral",
		"scripts/models/model-employer",
		"scripts/collections/collection-connections"
	],
	function($, Cookie, Analytics, App, Utils, Marionette, Template, ModelUser, ModelNetwork, ModelJob, ModelCandidate, ModelReferral, ModelEmployer, CollectionConnections){
	"use strict";

	var ViewJobs = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		jobGUID : null,
		candidateGUID : null,
		numberOfCalls : 0,
		template: Template,
		events : {
			"click #add-new-job"			: "addNewJob",
			"click #cancel-add"				: "cancelAddJob",
			"click #save-add"				: "saveAddJob",
			"click .candidates-info .link"	: "candidates",
			"click .edit-job"				: "editJob",
			"click #job-list > li"			: "editJob",
			"click .save-job"				: "saveJob",
			"click .add-referral-bonus"		: "addReferralBonus",
			"click .cancel-edit"			: "cancelEdit",
			"click button.job-status"		: "jobStatus",
			"click .post-job"				: "postJob",
			"click .unpost-job"				: "unpostJob",
			"click .delete-job"				: "deleteJob",
			"click .copy-tiny-url"			: "copyTinyURL",
			"click .share-with-employees"	: "shareJobWithEmployees",
			"click .share-with-followers"	: "shareJobWithFollowers",
			"click .share-with-connections"	: "shareJobWithConnections"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Jobs view initialized...");
			this.listenTo(App, "alertPrimaryAction", this.alertPrimaryAction);
			this.listenTo(App, "alertSecondaryAction", this.alertSecondaryAction);
		},

		alertPrimaryAction : function(){
			var listener = $("#app-alert").attr("data-listener");
			switch(listener){
				case "delete":
					this.completeDeleteJob();
				break;
			}
		},

		alertSecondaryAction : function(){
			var listener = $("#app-alert").attr("data-listener");
			switch(listener){
				case "delete":
					this.cancelDeleteJob();
				break;
			}
		},

		onShow : function(){
			ga('create', 'UA-52257201-1', 'hotschedulespost.com');
      		ga('send', 'pageview', '/jobs');

			$("#new-bonus, .bonus").keyup(function(){
    			var value = $(this).val();
    			value = value.replace(/[^0-9]+/g, '');
    			$(this).val(value);
			});

			// Show intersted user count if there are no jobs for the employer
			var jobs = this.model.jobs;
			if(jobs.length === 0){
				var employerGUID = App.router.controller.getEmployerGUID();
				var employer = new ModelEmployer();
					employer.getInterestedUsersCount(employerGUID,function(data){
						if(data.length !== 0){
							Utils.ShowNewJobRequestDialog(data);
						}
					});
			}
		},

		addNewJob : function(){			
			var isEditExpanded = $("#job-list > li .edit-mode").hasClass("show");
			if(!isEditExpanded){
				$("#add-job").addClass("show");
				var jobs = $("#job-list > li");
				var edits = $(".edit-mode");
				$(jobs).removeClass("expanded").removeClass("faded");
				$(edits).removeClass("show");
			}

		},

		cancelAddJob : function(){
			$("#add-job").removeClass("show");
			$("#add-job").find(".input-container.referral-bonus:eq(0)").removeClass("hidden");
			$("#add-job").find(".input-container.referral-bonus:eq(1)").addClass("hidden");
		},

		saveAddJob : function(){
			var wage = $("#new-wage").val();
			var bonus = $("#new-bonus").val();
			var wholeNumber = /^[0-9]+$/;
			var currency = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/
			if(wage === ""){
				Utils.ShowToast({message : "Wage is required"});
			}else if(!currency.test(wage)){
				Utils.ShowToast({message : "Invalid wage amount"});
			}else if(bonus !== "" && !wholeNumber.test(bonus)){
				Utils.ShowToast({message : "Invalid bonus amount"});
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
					job.updatedBy.guid = App.session.get("guid");
					job.createdBy.guid = App.session.get("guid");
					job.employer.guid = App.router.controller.getEmployerGUID();

					job.jobName = $("#new-position button").text();
					job.description = $("#new-description").val();
					job.wage = wage; 

					if(bonus !== ""){
						job.referralBonus = bonus;
					}

					job.wageType = $("#new-wage-type .custom-select-button").text().replace("-", "").toUpperCase();
					job.jobType.guid = $("#new-position .custom-select-list li:contains('"+job.jobName+"')").attr("id");

				var that = this;
				var model = new ModelJob();				
					model.save(job,{
						type : "POST",
						success : function(response){
							console.log("Job successfully saved");
							ga('send', 'event', 'button', 'click', 'add job');
							var jobGUID = response.attributes.guid;
							Utils.ShowSharePostedJobAlert(jobGUID);	
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
			var allEdits = $("#job-list > li .edit-mode");
			var li = $(event.target).closest("#job-list > li");
			var edit = $(li).find(".edit-mode");
			$(add).removeClass("show");
			var isEditExpanded = $("#job-list > li .edit-mode").hasClass("show");
			if(!isEditExpanded){
				$(all).removeClass("expanded");
				$(all).addClass("faded");
				$(allEdits).removeClass("show");
				$(edit).addClass("show");
				$(li).removeClass("faded");
				$(li).addClass("expanded");
			}

			event.stopPropagation();
		},

		cancelEdit : function(event){
			var all = $("#job-list > li");
			var allEdits = $("#job-list > li .edit-mode");
			var item = $(event.target).closest("#job-list > li");
			var bonus = $(item).find(".edit-mode input.bonus").val();
			if(bonus == ""){
				$(item).find(".input-container.referral-bonus:eq(0)").removeClass("hidden");
				$(item).find(".input-container.referral-bonus:eq(1)").addClass("hidden");
			}
			$(all).removeClass("expanded");
			$(all).removeClass("faded");
			$(allEdits).removeClass("show");
			event.stopPropagation();
		},

		addReferralBonus : function(event){
			var link = $(event.target).parent()
				$(link).next().removeClass("hidden");
				$(link).next().find(".bonus").focus();
				$(link).addClass("hidden");
				ga('send', 'event', 'input field', 'changed', 'add referral bonus');
				event.stopPropagation();
		},

		saveJob : function(event){
			console.log("Save job...");

			var item = $(event.target).parent().closest("#job-list > li");
			var index = $(item).index();
			var job = this.model.jobs[index];

			var wage = $(item).find(".wage").val();
			var bonus = $(item).find(".bonus").val();

			var wholeNumber = /^[0-9]+$/;
			var currency = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/

			if(wage === ""){
				Utils.ShowToast({message : "Wage is required"});
			}else if(!currency.test(wage)){
				Utils.ShowToast({message : "Invalid wage amount"});
			}else if(bonus !== "" && !wholeNumber.test(bonus)){
				Utils.ShowToast({message : "Invalid bonus amount"});
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
					update.description = $(item).find(".job-description").val();
					update.wage = wage
					update.wageType = $(item).find(".wage-type .custom-select-button").text().replace("-", "").toUpperCase();

					update.jobType.id = job.jobType.id;
					update.jobType.guid = $(item).find(".position .custom-select-list li:contains('"+update.jobName+"')").attr("id");

					update.employer.id = job.employer.id;
					update.employer.guid = job.employer.guid;

					update.created = job.created;
					update.createdBy = job.createdBy;

					update.updatedBy.id = job.updatedBy.id
					update.updatedBy.guid = App.session.get("guid");

					update.shifts = [{id : 0}];

					if(bonus === ""){
						update.referralBonus = 0;
					}else{
						update.referralBonus = bonus;
					}

					var that = this;
					var model = new ModelJob();	
						model.save(update,{
							type : "PUT",
							success : function(){
								ga('send', 'event', 'button', 'click', 'edit job');
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

		expandJob : function(event){

			var link = $(event.target);
			var noCandidates = link.hasClass("no");

			if(!noCandidates){
				var add = $("#add-job");
				var all = $("#job-list > li");
				var allEdits = $("#job-list > li .edit-mode");
				var li = $(event.target).closest("#job-list > li");
				var edit = $(li).find(".edit-mode");
				$(add).removeClass("show");
				var isEditExpanded = $("#job-list > li .edit-mode").hasClass("show");
				if(!isEditExpanded){
					$(all).removeClass("expanded");
					$(all).addClass("faded");
					$(allEdits).removeClass("show");
					if(!isCandidatesListExpanded){
						$(li).addClass("expanded");
					}else{
						$(li).removeClass("expanded");
						$(all).removeClass("faded");
					}
				}
			}
			event.stopPropagation();
		},

		candidates : function(event){
			var noCandidates = $(event.target).hasClass("no");
			if(!noCandidates){
				var guid = $(event.target).closest("li").attr("data-guid");
				App.router.navigate("candidates/job/"+guid, true);
			}
			event.stopPropagation();
		},

		jobStatus : function(event){
			$(".custom-select-list").removeClass("show");
			$(".custom-select-list.job-status").click(function(){
				$(".custom-select-list").removeClass("show");
			});

			var list = $(event.target).next();
			$(list).addClass("show");

			event.stopPropagation();
		},

		postJob : function(event){
			var item = $(event.target);
			var job = $(item).closest("#job-list.grid-list > li").data("guid");
			var currentState = $(item).closest("#job-list.grid-list > li .job-actions .custom-select").attr("data-value");
		
			if(currentState !== "POSTED"){
				this.updateJobStatus(job,"post");
			}
	
			ga('send', 'event', 'button', 'click', 'post job');
			event.stopPropagation();
		},

		unpostJob : function(event){
			var item = $(event.target);
			var job = $(item).closest("#job-list.grid-list > li").data("guid");
			var currentState = $(item).closest("#job-list.grid-list > li .job-actions .custom-select").attr("data-value");

			if(currentState !== "UNPOSTED"){
				this.updateJobStatus(job,"unpost");
			}

			ga('send', 'event', 'button', 'click', 'unpost job');
			
			event.stopPropagation();
		},

		deleteJob : function(event){
			var item = $(event.target);
			var job = $(item).closest("#job-list.grid-list > li").data("guid");
			this.jobGUID = job;
			Utils.ShowAlert({listener : "delete", primary : true, primaryType : "destroy", primaryText : "Delete", title : "Delete Job", message : "Are you sure you want to delete this job?" });
			event.stopPropagation();
		},

		cancelDeleteJob : function(){
			Utils.HideAlert();
		},

		completeDeleteJob : function(){

			Utils.HideAlert();

			var restURL = Utils.GetURL("/services/rest/job/");

			$.ajax({
				url : restURL + this.jobGUID,
				type : "DELETE",
				dataType : "text",
				success : function(){
					ga('send', 'event', 'button', 'click', 'delete job');
					App.router.controller.jobs();
				},
				error : function(){
					console.log("Error deleting job...");
					Utils.ShowToast({ message : "Error deleting job..."});
				}
			});
		},

		updateJobStatus : function(jobGUID, type){

			var restURL = Utils.GetURL("/services/rest/job/");

			var status = 0;

			if(type == "unpost"){
				status = 1
			}
							
			$.ajax({
				url : restURL + jobGUID + "/status/"+status,
				type : "PUT",
				success : function(response){
					if(status == 0){
						Utils.ShowSharePostedJobAlert(jobGUID);	
					}else{
						App.router.controller.jobs();
					}
				},
				error : function(){
					console.log("Error update job status...");
					Utils.ShowToast({ message : "Error update job status..."});
				}
			});
		},

		copyTinyURL : function(event){
			var item = $(event.target);
			var isDisabled = $(item).hasClass("disabled")

			if(!isDisabled){
				var url = $(item).data("url");
				var alert = $("#app-alert-tinyurl");
				$(alert).find(".jobURL").val(url);
				$(alert).addClass("show");
				$(document).find("#app-modal").addClass("show");
			}

			ga('send', 'event', 'button', 'click', 'copy job link');

			event.stopPropagation();
		},

		shareJobWithEmployees : function(event){
			var item = $(event.target);
			var isDisabled = $(item).hasClass("disabled")
			if(!isDisabled){
				var job = $(item).closest("#job-list.grid-list > li").data("guid");	
				this.shareJob(job,1);
			}
			ga('send', 'event', 'button', 'click', 'share job with employees');
			event.stopPropagation();
		},

		shareJobWithFollowers : function(event){
			var item = $(event.target);
			var isDisabled = $(item).hasClass("disabled")
			if(!isDisabled){
				var job = $(item).closest("#job-list.grid-list > li").data("guid");	
				this.shareJob(job,2);
			}
			ga('send', 'event', 'button', 'click', 'share job with followers');
			event.stopPropagation();
		},

		shareJobWithConnections : function(event){
			var item = $(event.target);
			var isDisabled = $(item).hasClass("disabled")
			if(!isDisabled){
				var job = $(item).closest("#job-list.grid-list > li").data("guid");	
				this.shareJob(job,3);
			}
			ga('send', 'event', 'button', 'click', 'share job with connections');
			event.stopPropagation();
		},

		shareJob : function(jobGUID,shareType){
				var share = new Object();
					share.fromUser = new Object();
					share.jobPosting = new Object();
					share.employer = new Object();

					share.fromUser.guid = App.session.get("guid");
					share.jobPosting.guid = jobGUID
					share.employer.guid = App.router.controller.getEmployerGUID();
					share.type = shareType;

				var that = this;
				var restURL = Utils.GetURL("/services/rest/share");
				
				$.ajax({
					headers: { 
				        'Accept': 'application/json',
				        'Content-Type': 'application/json' 
				    },
					url : restURL,
					type : "POST",
					data: JSON.stringify(share),
	    			processData: false,
	    			success : function(response){
	    				Utils.ShowToast({ type : "success", message : "Job shared successfully"});		
	    			},
	    			error : function(response){
	    				Utils.ShowToast({message : "Error sharing job"});
	    			}
				});
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