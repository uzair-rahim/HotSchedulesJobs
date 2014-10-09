define([
		"jquery",
		"jquerycookie",
		"analytics",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-candidates",
		"scripts/models/model-user",
		"scripts/models/model-network",
		"scripts/models/model-job",
		"scripts/models/model-candidate",
		"scripts/models/model-referral",
		"scripts/collections/collection-connections"
	],
	function($, Cookie, Analytics, App, Utils, Marionette, Template, ModelUser, ModelNetwork, ModelJob, ModelCandidate, ModelReferral, CollectionConnections){
	"use strict";

	var ViewCandidates = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		candidateGUID : null,
		numberOfCalls : 0,
		events : {
			"click #breadcrumb li" 			: "back",
			"click #archive-candidates"		: "archiveCandidates",
			"click #filter"					: "showFilter",
			"click #cancel-filter"			: "hideFilter",
			"click #search-filter"			: "searchFilter",
			"click #clear"					: "clearAllFilter",
			"click .view-profile"			: "profile",
			"click .candidate-referral"		: "candidateReferral",
			"click .candidate-select"		: "candidateSelect",
			"click .candidate-chat"			: "candidateChat",
			"click #send-chat"				: "sendBulkChat",
			"click .candidate-archive"		: "candidateArchive",
			"click .candidate-unarchive"	: "candidateUnarchive",
			"click .candidate-network"		: "candidateNetwork",
			"click .candidate-endorse"		: "candidateEndorsements",
			"click .user-connect"			: "createConnection",
			"click .user-disconnect"		: "deleteConnection",
			"click .candidate-status"		: "confirmCandidateStatusChange"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Candidates view initialized...");
			this.listenTo(App, "alertPrimaryAction", this.alertPrimaryAction);
			this.listenTo(App, "alertSecondaryAction", this.alertSecondaryAction);
		},

		alertPrimaryAction : function(){
			var listener = $("#app-alert").attr("data-listener");
			switch(listener){
				case "hire":
					this.updateCandidateStatus();
				break;
			}
		},

		alertSecondaryAction : function(){
			var listener = $("#app-alert").attr("data-listener");
			switch(listener){
				case "hire":
					Utils.HideAlert();
				break;
			}
		},

		onShow : function(){
			ga('create', 'UA-52257201-1', 'hotschedulespost.com');
      		ga('send', 'pageview', '/candidates');


			if(this.options.mode === "child"){
				$("#filter").hide();
				this.numberOfJobs = 1;
			}

			var loggedUserGUID = Utils.GetUserSession().guid;
			var candidatesList = $(".grid-list");
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

		back : function(event){
			var index = $(event.target).index();
			var goBack = (index+1) - App.getTrailLength();

			if(goBack !== 0){
				window.history.go(goBack);
			}
		},

		profile : function(event){

			var list = $(event.target).closest("ul").attr("id");

			if(list !== "archived-candidates-list"){

				var item = $(event.target).closest("#candidates-list > li");
				var userGuid = $(item).attr("data-user");
				var job = $(item).closest("#candidates-list");
				var isNewCandidate = $(item).find(".candidate-name").hasClass("new");
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

			}

			ga('send', 'event', 'button', 'click', 'view candidate profile');
			event.stopPropagation();
		},

		candidateSelect : function(event){
			var isChecked = $(event.target).prop("checked");

			if(isChecked){
				var userGUID = $(event.target).closest("li.view-profile").attr("data-user");
				$('li.view-profile[data-user="'+userGUID+'"]').find(".candidate-select:not(:checked)").prop("disabled", true);
			}

			var count = $(".candidate-select:checked").length;
			if(count > 0){
				$("#send-chat").prop("disabled",false);
				$("#archive-candidates").prop("disabled",false);
			}else{
				this.disableToolbarButtons();
			}
			event.stopPropagation();
		},

		candidateChat : function(event){
			ga("send", "event", "send-message-candidate", "click");
			var candidate = $(event.target).closest("li.view-profile");
			var jobPostingGUID = $(event.target).closest("ul#candidates-list").attr("data-guid");
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
			ga('send', 'event', 'button', 'click', 'send candidate message');
			event.stopPropagation();
		},

		sendBulkChat : function(event){
			ga("send", "event", "send-bulk-message-candidate", "click");
			var candidates = $(".candidate-select:checked");
			var jobPostingGUID = $(".candidate-select:checked").closest("ul.grid-list").attr("data-guid");
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
			ga('send', 'event', 'button', 'click', 'send bulk messages');
		},

		candidateArchive : function(event){

			var candidate = $(event.target).closest("#candidates-list > li");
			var job = $(candidate).closest("#candidates-list");
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
							Backbone.history.loadUrl();
						},
						error : function(){
							console.log("There was an error trying to mark the cadndidates as archived");
							Utils.ShowToast({ message : "Unexpected error occured"});
						}
					});

			ga('send', 'event', 'button', 'click', 'archive candidate');
			event.stopPropagation();
			
		},

		candidateUnarchive : function(event){

			var candidate = $(event.target).closest("#archived-candidates-list > li");
			var job = $(candidate).closest(".view-profile");
			var seen = $(candidate).closest(".view-profile").find(".candidate-info .candidate-name").hasClass("new");
			var request = new Object();
			var update = new Object();

				request.type = "update";
				request.jobGuid = $(job).attr("data-job");
				request.guid = $(candidate).attr("data-guid");

				update.id = $(candidate).attr("data-id");;
				update.archived = false;
				update.seen = !seen;

				var candidate = new ModelCandidate(request);

					candidate.save(update, {
						success : function(){
							console.log("Candidate successfully marked as unarchived...");
							Backbone.history.loadUrl();
						},
						error : function(){
							console.log("There was an error trying to mark the cadndidates as unarchived");
							Utils.ShowToast({ message : "Unexpected error occured"});
						}
					});

			ga('send', 'event', 'button', 'click', 'unarchive candidate');
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

			ga('send', 'event', 'button', 'click', 'candidate network');
			event.stopPropagation();
		},

		candidateReferral : function(event){
			var user = $(event.target).closest(".view-profile");
			var job = $(event.target).closest("#candidates-list");
			var userGUID = $(user).attr("data-user");
			var jobPostingGUID = $(job).attr("data-guid");

			var referral = new ModelReferral();
				referral.getReferralsList(jobPostingGUID, userGUID, function(data){
					Utils.ShowReferrals(data);
				});

			ga('send', 'event', 'button', 'click', 'candidate referrals');
			event.stopPropagation();
		},

		candidateEndorsements : function(event){
			var user = $(event.target).closest(".view-profile");
			var userGUID = $(user).attr("data-user");

			var endorsements = new ModelUser();
				endorsements.getEndorsements(userGUID, function(data){
					Utils.ShowEndorsements(data);
				});

			ga('send', 'event', 'button', 'click', 'candidate endorsements');
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
				var job = $(element).closest("#candidates-list");

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

			ga('send', 'event', 'button', 'click', 'bulk archive candidates');
		},

		showFilter : function(){
			var flyout = $("#filter-flyout");
			var isFlyoutVisible = $(flyout).hasClass("show");

			if(isFlyoutVisible){
				this.hideFilter();
			}else{
				$(flyout).addClass("show");
			}

		},

		hideFilter : function(){
			var flyout = $("#filter-flyout");
			$(flyout).removeClass("show");
		},

		searchFilter : function(){

			var flyout = $("#filter-flyout");
			var checkboxes = $(flyout).find(".filter-section input[type='checkbox']:checked");
			var archivedCheckbox = $(flyout).find("#archived-candidates:checked");
			var isCheckboxSelected = $(checkboxes).length > 0;
			var isArchivedCandidatesSelected = archivedCheckbox.length > 0;

			var candidatesList = $(".candidates-list-container .candidate-section");
			var archivedCandidatesList = $(".archived-candidates-list-container");			

			if(isCheckboxSelected){
				$(document).find(candidatesList).hide();
				$(document).find(archivedCandidatesList).hide();

				$(checkboxes).each(function(){
					var id = $(this).attr("id");
					console.log(id)
					$(".candidate-section[id='"+id+"']").show();
				});

			}else{
				$(".candidate-section").show();
			}

			if(isArchivedCandidatesSelected){
				$(archivedCandidatesList).show();
			}

			if(!isCheckboxSelected && !isArchivedCandidatesSelected){
				$(archivedCandidatesList).show();
			}

			this.hideFilter();
		},

		clearAllFilter : function(){
			$(".filter-section .checkbox-group input").prop("checked", false);
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

				ga('send', 'event', 'button', 'click', 'accept connection request from candidate');
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

				ga('send', 'event', 'button', 'click', 'create new connection with candidate');
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

			ga('send', 'event', 'button', 'click', 'delete connection with candidate');
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
			var mode = false;

			if(this.options.mode === "child"){ mode = true; }

			var jsonObject = new Object();
				jsonObject.language = App.Language;
				jsonObject.jobtypes = this.model.jobtypes;
				jsonObject.jobs = this.model.jobs;
				jsonObject.sub = mode;
				jsonObject.breadcrumb = App.getTrail();
			return jsonObject;
		}
		
	});

	return ViewCandidates;
});