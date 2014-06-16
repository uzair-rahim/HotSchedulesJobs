define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-candidates",
		"scripts/models/model-candidate",
		"scripts/collections/collection-connections"
	],
	function($, Cookie, App, Utils, Marionette, Template, ModelCandidate, CollectionConnections){
	"use strict";

	var ViewCandidates = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		numberOfCalls : 0,
		numberOfJobs : 0,
		events : {
			"click #breadcrumb li" 			: "back",
			"click #send-message"			: "sendMessage",
			"click #archive-candidates"		: "archiveCandidates",
			"click #filter"					: "showFilter",
			"click #cancel-filter"			: "hideFilter",
			"click #search-filter"			: "searchFilter",
			"click #clear"					: "clearAllFilter",
			"click .view-profile"			: "profile",
			"click .referred-by"			: "candidateReferral",
			"click #segmented-referrals"	: "showSegmentedReferrals",
			"click #segmented-pending"		: "showSegmentedPending",
			"click #close-referral-list"	: "closeCandidateReferral",
			"click .candidate-select"		: "candidateSelect",
			"click .candidate-message"		: "candidateMessage",
			"click .candidate-archive"		: "candidateArchive",
			"click .candidate-unarchive"	: "candidateUnarchive",
			"click .candidate-network"		: "candidateNetwork"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Candidates view initialized...");
		},

		onShow : function(){
			this.numberOfJobs = this.model.jobs.length;

			if(this.options.mode === "child"){
				$("#filter").hide();
				this.numberOfJobs = 1;
			}

			
			this.getSharedConnections();
			this.getReferralsForCandidates();
		},

		back : function(event){
			var index = $(event.target).index();
			var goBack = (index+1) - App.getTrailLength();

			if(goBack !== 0){
				window.history.go(goBack);
			}
		},

		getSharedConnections : function(){

			if(this.numberOfJobs > 0){
				var that = this;
				var index = this.numberOfJobs-1;
				var job;

				if(this.options.mode === "child"){
					job = this.model.jobs.jobs.guid;
				}else{
					job = this.model.jobs[index].guid;					
				}

				var connections = new CollectionConnections({jobGUID : job, userGUID : Utils.GetUserSession().guid});
				connections.fetch({
					success : function(response){
						console.log("Shared connections fetched successfully...");
						for(var i = 0; i < response.length; i++){

							var candidate = response.models[i].attributes.candidateGuid;
							var total = response.models[i].attributes.totalConnections;
							var shared = response.models[i].attributes.sharedConnections.length;
							
							var element = $("#candidates-list[data-guid='"+job+"'] li[data-guid='"+candidate+"'] .candidate-network");
							var archived = $("#archived-candidates-list li[data-guid='"+candidate+"'] .candidate-network");

							$(element).addClass("has-connections");
							$(element).html("<span>"+shared+"</span> / "+total);

							$(archived).addClass("has-connections");
							$(archived).html("<span>"+shared+"</span> / "+total);

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

			$.each(candidates, function(){
				var that = this;
				var restURL = Utils.GetURL("/services/rest/referral/?jobPostingGuid="+this.job+"&userGuid="+this.user);
				$.ajax({
					url : restURL,
					type : "GET",
					success : function(response){
						var referred = $("#candidates-list[data-guid='"+that.job+"'] > li[data-user='"+that.user+"'] .candidate-referral .referred-by");
						if(response.length === 1 ){
							$(referred).find(".name").text(response[0].referringUser.firstname + " " + response[0].referringUser.lastname.charAt(0) + ". referral");	
		    				$(referred).find(".picture").html("<img src='"+response[0].referringUser.photo.url+"'/>");
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

			var alert = $("#app-alert-referral");
				$(alert).find(".alert-title").text(name + " Referrals");

			var alertWidth = $(alert).width();	
			var alertHeight = $(alert).height();
			var windowWidth = $(window).width();
			var windowHeight = $(window).height();

				$(alert).css("margin-top", "0");

				$(alert).css("top", windowHeight/2 - alertHeight/2);
				$(alert).addClass("show");

				$(document).find("#app-modal").addClass("show");

			event.stopPropagation();
		},

		showSegmentedReferrals : function(){
			$("#pending-segment").hide();
			$("#referrals-segment").show();

			$("#segmented-referrals").removeClass("unselected");
			$("#segmented-pending").addClass("unselected");
		},

		showSegmentedPending : function(){
			$("#referrals-segment").hide();
			$("#pending-segment").show();

			$("#segmented-pending").removeClass("unselected");
			$("#segmented-referrals").addClass("unselected");
			
		},

		closeCandidateReferral : function(event){
			var alert = $("#app-alert-referral");
				$(alert).removeClass("show");
				$(document).find("#app-modal").removeClass("show");
		},

		sendMessage : function(){
			alert("Send a Message");
		},

		profile : function(event){
			
			var item = $(event.target).closest("#candidates-list > li");
			var job = $(item).closest("#candidates-list");
			var isNewCandidate = $(item).find("*").hasClass("new");
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
			alert("Send Message");
			event.stopPropagation();
		},

		candidateArchive : function(event){

			var candidate = $(event.target).closest("#candidates-list > li");
			var job = $(candidate).closest("#candidates-list");
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
			var request = new Object();
			var update = new Object();

				request.type = "update";
				request.jobGuid = $(job).attr("data-job");
				request.guid = $(candidate).attr("data-guid");

				update.id = $(candidate).attr("data-id");;
				update.archived = false;

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
				var job = $(element).closest("#candidates-list");

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