define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-candidates",
		"scripts/models/model-user",
		"scripts/models/model-candidate",
		"scripts/collections/collection-connections"
	],
	function($, Cookie, App, Utils, Marionette, Template, ModelUser, ModelCandidate, CollectionConnections){
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
			"click .referred-by"			: "candidateReferral",
			"click .candidate-select"		: "candidateSelect",
			"click .candidate-message"		: "candidateMessage",
			"click #send-message"			: "sendBulkMessage",
			"click .candidate-archive"		: "candidateArchive",
			"click .candidate-unarchive"	: "candidateUnarchive",
			"click .candidate-network"		: "candidateNetwork"
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
			var candidate = $(event.target).closest(".view-profile");
			var name = $(candidate).find(".candidate-info .candidate-name").text();
			Utils.SetSharedConnectionName(name);
			var guid = $(candidate).attr("data-user");
			App.router.navigate("connections/"+guid, true);
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