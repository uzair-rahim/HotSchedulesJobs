define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-jobs",
		"scripts/models/model-job",
		"scripts/models/model-candidate",
		"scripts/collections/collection-connections"
	],
	function($, Cookie, App, Utils, Marionette, Template, ModelJob, ModelCandidate, CollectionConnections){
	"use strict";

	var ViewJobs = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		jobGUID : null,
		numberOfCalls : 0,
		numberOfJobs : 0,
		referralsArray : [],
		template: Template,
		events : {
			"click #add-new-job"			: "addNewJob",
			"click #cancel-add"				: "cancelAddJob",
			"click #save-add"				: "saveAddJob",
			"click #job-list > li"			: "expandJob",
			"click #archive-candidates"		: "archiveCandidates",
			"click .edit-job"				: "editJob",
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
			"click .view-candidates" 		: "candidates",
			"click .view-profile"			: "profile",
			"click .referred-by"			: "candidateReferral",
			"click .candidate-select"		: "candidateSelect",
			"click .candidate-message"		: "candidateMessage",
			"click #send-message"			: "sendBulkMessage",
			"click .candidate-archive"		: "candidateArchive",
			"click .candidate-network"		: "candidateNetwork"
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
			this.referralsArray = [];
			this.numberOfJobs = this.model.jobs.length;
			this.getSharedConnections();
			this.getReferralsForCandidates();

			$("#new-bonus, .bonus").keyup(function(){
    			var value = $(this).val();
    			value = value.replace(/[^0-9]+/g, '');
    			$(this).val(value);
			});
		},

		getSharedConnections : function(){

			if(this.numberOfJobs > 0){
				var that = this;
				var index = this.numberOfJobs-1;
				var job = this.model.jobs[index].guid

				var connections = new CollectionConnections({jobGUID : job, userGUID : Utils.GetUserSession().guid});
				connections.fetch({
					success : function(response){
						console.log("Shared connections fetched successfully...");
						for(var i = 0; i < response.length; i++){

							var candidate = response.models[i].attributes.candidateGuid;
							var total = response.models[i].attributes.totalConnections;
							var shared = response.models[i].attributes.sharedConnections.length;
							
							var element = $("#job-list li[data-guid='"+job+"'] li[data-guid='"+candidate+"'] .candidate-network");
							$(element).addClass("has-connections");
							$(element).html("<span>"+shared+"</span> / "+total);

						}

						that.numberOfJobs--;
						that.getSharedConnections();
					},
					error : function(){
						console.log("There was an error trying to fetch shared connections");
						Utils.ShowToast({ message : "Error fetching shared connections..."});
					}
				});
			}

		},

		getAllCandidates : function(){

			var list = new Array();
			var jobs = this.model.jobs;

			for(var job in jobs){
				for(var index = 0; index < jobs[job].candidates.length; index++){
					var data = new Object();
						data.job = jobs[job].guid;
						data.user = jobs[job].candidates[index].user.guid;
					list.push(data);
				}
			}

			return list;
			
		},

		getReferralsForCandidates : function(){
			var candidates = this.getAllCandidates();
			var count = 0;
			var self = this;

			$.each(candidates, function(){
				var that = this;
				var restURL = Utils.GetURL("/services/rest/referral/?jobPostingGuid="+this.job+"&userGuid="+this.user);
				$.ajax({
					url : restURL,
					type : "GET",
					success : function(response){
						var referred = $("#job-list > li[data-guid='"+that.job+"'] #candidates-list li[data-user='"+that.user+"'] .candidate-referral .referred-by");

						if(response.length >= 1){
							$(referred).attr("data-id", count);
							count++;

							var referringUsers = new Array();

							for(var i = 0; i < response.length; i++){
								referringUsers.push(response[i]);
							}

							self.referralsArray.push(referringUsers);
						}

						if(response.length === 1 ){
							$(referred).find(".name").text(response[0].referringUser.firstname + " " + response[0].referringUser.lastname.charAt(0) + ". referral");	
		    				if(response[0].referringUser.photo !== null){
		    					$(referred).find(".picture").html("<img src='"+response[0].referringUser.photo.url+"'/>");
		    				}
						}else if(response.length > 1){
							$(referred).find(".name").text(response.length + " referrals");
						}else{
							$(referred).remove();
						}
					},
					error : function(){
						console.log("Error fetching referrals...");
						Utils.ShowToast({ message : "Error fetching referrals..."});
					}
				});
			});

		},

		candidateReferral : function(event){
			var candidate = $(event.target).closest(".view-profile");
			var name = $(candidate).find(".candidate-info .candidate-name").text();
				name = name.split(" ").slice(0, -1).join(' ') + "'s";

				$("#segmented-referrals span").text(0);
				$("#segmented-pending span").text(0);

			var id = $(event.target).closest(".referred-by").data("id");
			var candidatesReferrals = this.referralsArray[id];	
			var alert = $("#app-alert-referral");
				$(alert).find(".alert-body #referrals-segment ul.referrals-list").html("");
				$(alert).find(".alert-body #pending-segment ul.referrals-list").html("");

				var referrals = 0;
				var pending = 0;
				
				for(var i = 0; i < candidatesReferrals.length; i++){
					var photo = candidatesReferrals[i].referringUser.photo;
					var image;
					if(photo !== null){
						image = "<img src='"+photo.url+"'/>";
					}else{
						image = ""
					}

					var status = candidatesReferrals[i].status;

					var firstname = candidatesReferrals[i].referringUser.firstname;
					var lastname = candidatesReferrals[i].referringUser.lastname;
					var position = candidatesReferrals[i].referringUser.primaryWorkHistory.jobs[0].jobName;
					var employer = candidatesReferrals[i].referringUser.primaryWorkHistory.employer.name;

					if(status === 1){
						referrals++;
						$("#segmented-referrals span").text("("+referrals+")");
						$(alert).find(".alert-body #referrals-segment ul.referrals-list").append("<li><div class='picture'>"+image+"</div><div class='info'><div class='name'>"+firstname+" "+lastname+"</div><div class='position'>"+position+" @ "+employer+"</div></div></li>");
					}else{
						pending++;
						$("#segmented-pending span").text("("+pending+")");
						$(alert).find(".alert-body #pending-segment ul.referrals-list").append("<li><div class='picture'>"+image+"</div><div class='info'><div class='name'>"+firstname+" "+lastname+"</div><div class='position'>"+position+" @ "+employer+"</div></div></li>");
					}
				}

				if(referrals === 0){
					$(alert).find(".alert-body #referrals-segment ul.referrals-list").append("<li><div class='empty'>There are pending requests</div></li>")
				}

				if(pending === 0){
					$(alert).find(".alert-body #pending-segment ul.referrals-list").append("<li><div class='empty'>There are no pending requests</div></li>")
				}

			$(alert).find(".alert-title").text(name + " Referrals");
			$(alert).addClass("show");
			$(document).find("#app-modal").addClass("show");

			event.stopPropagation();
		},

		disableToolbarButtons : function(){
			$(".candidate-select").prop("checked", false);
			$("#send-message").prop("disabled", true);
			$("#archive-candidates").prop("disabled", true);
		},

		addNewJob : function(){
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
					job.updatedBy.guid = Utils.GetUserSession().guid;
					job.createdBy.guid = Utils.GetUserSession().guid;
					job.employer.guid = Utils.GetUserSession().employerIds[0];

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

			this.disableToolbarButtons();

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
			var guid = $(event.target).attr("id");
			App.router.navigate("candidates/job/"+guid, true);
			event.stopPropagation();
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
				$("#send-message").prop("disabled",false);
				$("#archive-candidates").prop("disabled",false);
			}else{
				$("#send-message").prop("disabled",true);
				$("#archive-candidates").prop("disabled",true);
			}
			event.stopPropagation();
		},

		candidateMessage : function(event){
			var email = $(event.target).closest("li.view-profile").data("email");
			window.location.href = "mailto:"+email;
			event.stopPropagation();
		},

		sendBulkMessage : function(event){
			var manager = Utils.GetUserSession().email;
			var addresses = [];

			$(".candidate-select:checked").each(function(){
				var email = $(this).closest("li.view-profile").data("email");
				addresses.push(email);
			});

			var emails = addresses.join(",");
			window.location.href = "mailto:"+manager+"?bcc="+emails;
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

			var count = $(event.target).find("span").text();

			if(count > 0){
				var candidate = $(event.target).closest(".view-profile");
				var guid = $(candidate).attr("data-user");
				App.router.navigate("connections/"+guid, true);
			}

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
	
			event.stopPropagation();
		},

		unpostJob : function(event){
			var item = $(event.target);
			var job = $(item).closest("#job-list.grid-list > li").data("guid");
			var currentState = $(item).closest("#job-list.grid-list > li .job-actions .custom-select").attr("data-value");

			if(currentState !== "UNPOSTED"){
				this.updateJobStatus(job,"unpost");
			}
			
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
					App.router.controller.jobs();
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

			event.stopPropagation();
		},

		shareJobWithEmployees : function(event){
			var item = $(event.target);
			var isDisabled = $(item).hasClass("disabled")

			if(!isDisabled){

				var job = $(item).closest("#job-list.grid-list > li").data("guid");

				var share = new Object();
					share.fromUser = new Object();
					share.jobPosting = new Object();
					share.employer = new Object();
					
					share.fromUser.guid = Utils.GetUserSession().guid;
					share.jobPosting.guid = job
					share.employer.guid = Utils.GetUserSession().employerIds[0];
					share.type = 1;

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
	    				Utils.ShowToast({ type : "success", message : "Job shared with all employees"});		
	    			},
	    			error : function(response){
	    				Utils.ShowToast({message : "Error sharing job"});
	    			}
				});

				
			}

			event.stopPropagation();
		},

		shareJobWithFollowers : function(event){
			var item = $(event.target);
			var isDisabled = $(item).hasClass("disabled")

			if(!isDisabled){

				var job = $(item).closest("#job-list.grid-list > li").data("guid");

				var share = new Object();
					share.fromUser = new Object();
					share.jobPosting = new Object();
					share.employer = new Object();

					share.fromUser.guid = Utils.GetUserSession().guid;
					share.jobPosting.guid = job
					share.employer.guid = Utils.GetUserSession().employerIds[0];
					share.type = 2;

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
	    				Utils.ShowToast({ type : "success", message : "Job shared with all followers"});		
	    			},
	    			error : function(response){
	    				Utils.ShowToast({message : "Error sharing job"});
	    			}
				});

				
			}

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