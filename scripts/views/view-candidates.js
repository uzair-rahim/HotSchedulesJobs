define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-candidates",
		"scripts/models/model-user",
		"scripts/models/model-network",
		"scripts/models/model-candidate",
		"scripts/models/model-referral",
		"scripts/collections/collection-connections"
	],
	function($, Cookie, App, Utils, Marionette, Template, ModelUser, ModelNetwork, ModelCandidate, ModelReferral, CollectionConnections){
	"use strict";

	var ViewCandidates = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
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
			"click .user-disconnect"		: "deleteConnection"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Candidates view initialized...");
		},

		onShow : function(){
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
					if(that.isUserConnected(userGUID)){
						var connectionIcon = $(this).find(".user-connect");
						connectionIcon.addClass("user-disconnect");
						connectionIcon.removeClass("user-connect");
					}

					if(userGUID == loggedUserGUID){
						var connectionIcon = $(this).find(".user-connect");
						connectionIcon.addClass("user-connect-self");
						connectionIcon.removeClass("user-connect");
					}
				});
			});
		},

		isUserConnected : function(userGUID){
			var connections = Utils.GetUserConnectionsList();
			var retval = false;
			$.each(connections, function(){
				if(this == userGUID){
					retval = true;
				}
			});

			return retval;
		},

		disableToolbarButtons : function(){
			$(".candidate-select").prop("checked", false);
			$("#send-chat").prop("disabled", true);
			$("#archive-candidates").prop("disabled", true);
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
											el += "<div class='employment-date'>@"+ this.employer.name +"</div>"
											el += "<div class='employment-date'>"+ Utils.FormatDate(this.startDate, "month/yyyy") + " - " + Utils.FormatDate(this.endDate, "month/yyyy") +"</div>"
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
			Utils.ShowSendNewMessage();
			event.stopPropagation();
		},

		sendBulkChat : function(event){	
			Utils.ShowSendNewMessage();
			this.disableToolbarButtons();
			$(".candidate-select").prop("checked", false);
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
			var job = $(event.target).closest("#candidates-list");
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
			this.numberOfCalls = $(".candidate-select:checked").length;
			this.bulkArchive();
			this.disableToolbarButtons();
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
			var connection = new Object();
				connection.fromUserGuid = Utils.GetUserSession().guid;
				connection.toUserGuid = $(event.target).closest("li.view-profile").attr("data-user");

			var icons = $("li.view-profile[data-user='"+connection.toUserGuid+"'] .user-connect");		

			var network = new ModelNetwork();
				network.createConnection(connection, function(data){
					icons.addClass("user-disconnect");
					icons.removeClass("user-connect");
					Utils.AddToUserConnectionsList(connection.toUserGuid);
				});

			event.stopPropagation();
		},

		deleteConnection : function(event){
			var connection = new Object();
				connection.fromUserGuid = Utils.GetUserSession().guid;
				connection.toUserGuid = $(event.target).closest("li.view-profile").attr("data-user");

			var icons = $("li.view-profile[data-user='"+connection.toUserGuid+"'] .user-disconnect");	
			
			var network = new ModelNetwork();
				network.deleteConnection(connection, function(data){
					icons.addClass("user-connect");
					icons.removeClass("user-disconnect");
					Utils.RemoveFromUserConnectionsList(connection.toUserGuid);
				});

			event.stopPropagation();
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