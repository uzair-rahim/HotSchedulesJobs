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
			"click .candidates-info .link"	: "expandJob",
			"click #archive-candidates"		: "archiveCandidates",
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
			"click .share-with-connections"	: "shareJobWithConnections",
			"click .view-candidates" 		: "candidates",
			"click .close-candidates"		: "closeCandidates",
			"click .view-profile"			: "profile",
			"click .candidate-endorse"		: "candidateEndorsements",
			"click .candidate-referral"		: "candidateReferral",
			"click .candidate-select"		: "candidateSelect",
			"click .candidate-chat"			: "candidateChat",
			"click #send-chat"				: "sendBulkChat",
			"click .candidate-archive"		: "candidateArchive",
			"click .candidate-network"		: "candidateNetwork",
			"click .user-connect"			: "createConnection",
			"click .user-disconnect"		: "deleteConnection",
			"click .candidate-status"		: "confirmCandidateStatusChange"
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
				case "hire":
					this.updateCandidateStatus();
				break;
			}
		},

		alertSecondaryAction : function(){
			var listener = $("#app-alert").attr("data-listener");
			switch(listener){
				case "delete":
					this.cancelDeleteJob();
				break;
				case "hire":
					Utils.HideAlert();
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

			var loggedUserGUID = Utils.GetUserSession().guid;
			var candidatesList = $(".grid-list.sub");
			var that = this;

			$.each(candidatesList, function(){
				var candidate = $(this).find("li.view-profile");
				$.each(candidate, function(){
					var userGUID = $(this).attr("data-user");
					if(userGUID == loggedUserGUID){
						var connectionIcon = $(this).find(".user-connect");
						connectionIcon.addClass("self");
					}else{
						var connection = that.isUserConnected(userGUID);
						if(connection !== null){
							var connectionIcon = $(this).find(".user-connect");
								if(connection.state == "connected" || connection.state == "sent"){
									connectionIcon.addClass("user-disconnect");
									connectionIcon.removeClass("user-connect");
								}else{
									connectionIcon.addClass(connection.state);
								}
						}
					}
				});
			});

			// Show intersted user count if there are no jobs for the employer
			var jobs = this.model.jobs;
			if(jobs.length === 0){
				var index = Utils.GetSelectedEmployer();
				var employerGUID = Utils.GetUserSession().employerIds[index];
				var employer = new ModelEmployer();
					employer.getInterestedUsersCount(employerGUID,function(data){
						if(data.length !== 0){
							Utils.ShowNewJobRequestDialog(data);
						}
					});
			}
		},

		isUserConnected : function(userGUID){
			var connections = Utils.GetUserConnectionsList();
			var retval = null;
			$.each(connections, function(){
				if(userGUID == this.toUserGUID || userGUID == this.fromUserGUID){
					retval = this;
				}
			});

			return retval;
		},

		disableToolbarButtons : function(){
			$("#send-chat").prop("disabled", true);
			$("#archive-candidates").prop("disabled", true);
			$(".candidate-select").prop("checked", false);
			$(".candidate-select").prop("disabled", false);
		},

		addNewJob : function(){
			
			var isEditExpanded = $("#job-list > li .edit-mode").hasClass("show");

			if(!isEditExpanded){

				this.disableToolbarButtons();

				$("#add-job").addClass("show");

				var jobs = $("#job-list > li");
				var cadndidates = $(".grid-list.sub");
				var profiles = $(".hourly-profile");
				var edits = $(".edit-mode");
				
				$(jobs).removeClass("expanded").removeClass("faded");
				$(cadndidates).removeClass("show");
				$(profiles).removeClass("show");
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
				var index = Utils.GetSelectedEmployer();
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
					job.employer.guid = Utils.GetUserSession().employerIds[index];

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
							if(that.job.referralBonus !== ""){
								ga('send', 'event', 'input field', 'changed', 'referral bonus', that.job.referralBonus);
							}
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

			this.disableToolbarButtons();

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

			$(add).removeClass("show");

			var isEditExpanded = $("#job-list > li .edit-mode").hasClass("show");
			var isCandidatesListExpanded = $(candidates).hasClass("show");

			//if(!isAddJobExpanded){
				//if(!isCandidatesListExpanded){

					if(!isEditExpanded){

						$(all).removeClass("expanded");
						$(all).addClass("faded");
						$(allListItems).removeClass("expanded");
						$(allListItems).removeClass("faded");
						$(allEdits).removeClass("show");
						$(allCandidates).removeClass("show");
						$(profile).removeClass("show");

						$(edit).addClass("show");
						$(li).removeClass("faded");
						$(li).addClass("expanded");
					}
				//}
			//}

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
					update.updatedBy.guid = Utils.GetUserSession().guid;

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
				this.disableToolbarButtons();

				var add = $("#add-job");
				var all = $("#job-list > li");
				var allListItems = $("#job-list li");
				var allEdits = $("#job-list > li .edit-mode");
				var allCandidates = $("#job-list > li .grid-list.sub");
				var li = $(event.target).closest("#job-list > li");
				var edit = $(li).find(".edit-mode");
				var candidates = $(li).find(".grid-list.sub");
				var allProfiles = $(li).find(".hourly-profile");

				$(add).removeClass("show");

				var isEditExpanded = $("#job-list > li .edit-mode").hasClass("show");
				var isCandidatesListExpanded = $(candidates).hasClass("show");

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

			}

			event.stopPropagation();

		},

		closeCandidates : function(event){
			var all = $("#job-list > li");
			var allListItems = $("#job-list li");
			var allEdits = $("#job-list > li .edit-mode");
			var allCandidates = $("#job-list > li .grid-list.sub");
			var allProfiles = $("#job-list > li .hourly-profile");
			
			$(all).removeClass("expanded");
			$(allListItems).removeClass("expanded");
			$(allListItems).removeClass("faded");
			$(allEdits).removeClass("show");
			$(allCandidates).removeClass("show");
			$(allProfiles).removeClass("show");

			this.disableToolbarButtons();

			event.stopPropagation();
		},

		candidates : function(event){
			var guid = $(event.target).attr("id");
			App.router.navigate("candidates/job/"+guid, true);
			event.stopPropagation();
		},

		profile : function(event){

			var item = $(event.target).closest(".view-profile");
			var userGuid = $(item).attr("data-user");
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

				var user = new ModelUser();
				user.set({guid : userGuid});
				user.getWorkHistory(function(){
					var history = user.get("workHistory");
					var list = $(item).find(".hourly-profile .history-section .work-history");
					$(list).html("");
					
					if(history.length > 0){
						$.each(history, function(){
							var el = "<li>";
									el += "<div class='employer-logo'>"
										if(this.employer.logo !== null){
											el += "<img src='"+this.employer.logo.url+"'/>";
										}
									el += "</div>"	
									el += "<div class='employment-info'>"
										el += "<div class='employer-name'>"
											var total = this.jobs.length;
											$.each(this.jobs, function(index){
												el += this.jobName;
												if(index !== total-1){
													el += ", ";
												}
											});
										el += "</div>"
										el += "<div class='employment-position'>@"+ this.employer.name +"</div>"
										el += "<div class='employment-date'>"+ Utils.FormatDate(this.startDateMillis, "month/yyyy") + " - " + Utils.FormatDate(this.endDateMillis, "month/yyyy") +"</div>"
									el += "</div>"
								el += "</li>"
							$(list).append(el);
						});
					}else{
						$(list).remove();
						$(item).find(".hourly-profile .history-section").append("<div class='history'>Not Available</div>");
					}

					
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

				});

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
				$("#send-chat").prop("disabled",false);
				$("#archive-candidates").prop("disabled",false);
			}else{
				$("#send-chat").prop("disabled",true);
				$("#archive-candidates").prop("disabled",true);
			}
			event.stopPropagation();
		},

		candidateChat : function(event){
			ga("send", "event", "send-message-jobs", "click");
			var candidate = $(event.target).closest("li.view-profile");
			var jobPostingGUID = $(event.target).closest("ul#job-list > li").attr("data-guid");
			var candidateName = candidate.find(".candidate-info .candidate-name").text();
			var candidateGUID = candidate.attr("data-user");

			var recipient = new Object();
				recipient.name = candidateName;
				recipient.guid = candidateGUID;

			var recipients = new Array();
				recipients.push(recipient);

			Utils.AddRecipientToNewMessage(recipients);
			Utils.SetJobPostingGUID(jobPostingGUID);
			Utils.ShowSendNewMessage();
			event.stopPropagation();
		},

		sendBulkChat : function(event){
			ga("send", "event", "send-bulk-message-jobs", "click");
			var candidates = $(".candidate-select:checked");
			var jobPostingGUID = $(".candidate-select:checked").closest("ul#job-list > li").attr("data-guid");
			var recipients = new Array();

			$.each(candidates, function(){
				var recipient = new Object();
					recipient.name = $(this).closest("li.view-profile").find(".candidate-info .candidate-name").text();
					recipient.guid = $(this).closest("li.view-profile").attr("data-user");
				recipients.push(recipient);
			});

			Utils.AddRecipientToNewMessage(recipients);
			Utils.SetJobPostingGUID(jobPostingGUID);
			Utils.ShowSendNewMessage();
			this.disableToolbarButtons();
			$(".candidate-select").prop("checked", false);
		},

		candidateArchive : function(event){

			var candidate = $(event.target).closest(".view-profile");
			var job = $(candidate).closest("#job-list > li");
			var seen = $(candidate).find(".candidate-info .candidate-name").hasClass("new");

			var request = new Object();
			var update = new Object();

				request.type = "update";
				request.jobGuid = $(job).attr("data-guid");
				request.guid = $(candidate).attr("data-guid");

				update.id = $(candidate).attr("data-id");;
				update.archived = true;
				update.seen = !seen;

				var candidate = new ModelCandidate(request);

					candidate.save(update, {
						success : function(){
							console.log("Candidate successfully marked as archived...");
							ga('send', 'event', 'button', 'click', 'archive candidate');
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
			var user = $(event.target).closest(".view-profile");
			var guid1 = Utils.GetUserSession().guid;
			var guid2 = $(user).attr("data-user");	

			var network = new ModelNetwork();
				network.getSharedConnections(guid1, guid2, function(data){
					Utils.ShowSharedConnections(data);
				});

			event.stopPropagation();
		},

		candidateReferral : function(event){
			var user = $(event.target).closest(".view-profile");
			var job = $(event.target).closest("#job-list > li");
			var userGUID = $(user).attr("data-user");
			var jobPostingGUID = $(job).attr("data-guid");

			var referral = new ModelReferral();
				referral.getReferralsList(jobPostingGUID, userGUID, function(data){
					Utils.ShowReferrals(data);
				});


			event.stopPropagation();
		},

		candidateEndorsements : function(event){
			var user = $(event.target).closest(".view-profile");
			var userGUID = $(user).attr("data-user");

			var endorsements = new ModelUser();
				endorsements.getEndorsements(userGUID, function(data){
					Utils.ShowEndorsements(data);
				});

			event.stopPropagation();
		},

		archiveCandidates : function(){
			ga('send', 'event', 'button', 'click', 'bulk archive candidate');
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

				var seen = $(element).closest(".view-profile").find(".candidate-info .candidate-name").hasClass("new");

				var request = new Object();
					request.type = "update";
					request.jobGuid = jobGuid;
					request.guid = guid;

				var update = new Object();
					update.id = id;	
					update.archived = true;
					update.seen = !seen;

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
				var index = Utils.GetSelectedEmployer();

				var share = new Object();
					share.fromUser = new Object();
					share.jobPosting = new Object();
					share.employer = new Object();

					share.fromUser.guid = Utils.GetUserSession().guid;
					share.jobPosting.guid = jobGUID
					share.employer.guid = Utils.GetUserSession().employerIds[index];
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

		createConnection : function(event){
			var icon = $(event.target);
			var isSelf = icon.hasClass("self");
			var isReceivedRequest = icon.hasClass("received");
			var network = new ModelNetwork();

			if(isSelf){
				event.stopPropagation();
				return;
			}
			
			if(isReceivedRequest){
				var userGUID = icon.closest("li.view-profile").attr("data-user");
				var connection = Utils.GetUserConnection(userGUID);
				var acceptThisConnection = new Object();
					acceptThisConnection.guid = connection.guid;
					acceptThisConnection.toUserGuid = connection.toUserGUID;
					acceptThisConnection.fromUserGuid = connection.fromUserGUID;

				var icons = $("li.view-profile[data-user='"+connection.fromUserGUID+"'] .user-connect");

				network.acceptConnection(acceptThisConnection, function(data){
					icons.addClass("user-disconnect");
					icons.removeClass("user-connect");
					icons.removeClass("received");

					var newConnection = new Object();
						newConnection.guid = data.guid;
						newConnection.fromUserGUID = data.fromUserGuid;
						newConnection.toUserGUID = data.toUserGuid;
						newConnection.state = "connected";
					Utils.RemoveFromUserConnectionsList(connection);
					Utils.AddToUserConnectionsList(newConnection);
				});

			}else{
				var connection = new Object();
					connection.fromUserGuid = Utils.GetUserSession().guid;
					connection.toUserGuid = $(event.target).closest("li.view-profile").attr("data-user");

				var icons = $("li.view-profile[data-user='"+connection.toUserGuid+"'] .user-connect");			

				network.createConnection(connection, function(data){
					icons.addClass("user-disconnect");
					icons.removeClass("user-connect");

					var newConnection = new Object();
						newConnection.guid = data.guid;
						newConnection.fromUserGUID = data.fromUserGuid;
						newConnection.toUserGUID = data.toUserGuid;
						newConnection.state = "sent";
					Utils.AddToUserConnectionsList(newConnection);
				});	
			}

			event.stopPropagation();
		},

		deleteConnection : function(event){
			var icon = $(event.target);
			var userGUID = icon.closest("li.view-profile").attr("data-user");
			var connection = Utils.GetUserConnection(userGUID);

			
			var deleteThisConnection = new Object();
				deleteThisConnection.fromUserGuid = connection.fromUserGUID;
				deleteThisConnection.toUserGuid = connection.toUserGUID;

			var icons = $("li.view-profile[data-user='"+userGUID+"'] .user-disconnect");
			
			var network = new ModelNetwork();
				network.deleteConnection(deleteThisConnection, function(data){
					icons.addClass("user-connect");
					icons.removeClass("user-disconnect");
					Utils.RemoveFromUserConnectionsList(connection);
				});

			event.stopPropagation();
		},

		confirmCandidateStatusChange : function(event){
			var item = $(event.target);
			var isHired = item.hasClass("create");
			var messageText = "Are you sure you want to hire this candidate?";
			var buttonType = "primary";
			if(isHired){
				messageText = "This candidate will no longer be marked as hired";
				buttonType = "destroy";
			}

			var candidate = $(item).closest("li.view-profile").data("guid");
				this.candidateGUID = candidate;
			Utils.ShowAlert({listener : "hire", primary : true, primaryType : buttonType, primaryText : "Confirm", title : "Hire Candidate", message : messageText });
			event.stopPropagation();
		},

		updateCandidateStatus : function(){
			var candidateStatusButton = $('li.view-profile[data-guid="'+this.candidateGUID+'"]').find(".candidate-status button");
			var candidateStatus = candidateStatusButton.hasClass("create");
			var candidateGUID = this.candidateGUID;
			var status = "";

			var candidateObject = new Object();
				candidateObject.hired = !candidateStatus;

			var job = new ModelJob();
				job.updateCandidateHired(candidateGUID,candidateObject,function(data){
					if(candidateStatus){
						candidateStatusButton.text("Candidate");
						candidateStatusButton.removeClass("create");
						status = "candidate";
					}else{
						candidateStatusButton.text("Hired");
						candidateStatusButton.addClass("create");
						status = "hired";
					}
					Utils.HideAlert();
				});

			ga("send", "event", "button", "click", status);
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