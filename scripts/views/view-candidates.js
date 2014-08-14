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
		numberOfJobs : 0,
		referralsArray : [],
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
			this.referralsArray = [];
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
			var count = 0;
			var self = this;

			$.each(candidates, function(){
				var that = this;
				var restURL = Utils.GetURL("/services/rest/referral/?jobPostingGuid="+this.job+"&userGuid="+this.user);
				$.ajax({
					url : restURL,
					type : "GET",
					success : function(response){
						var referred = $("#candidates-list[data-guid='"+that.job+"'] > li[data-user='"+that.user+"'] .candidate-referral .referred-by");

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

		sendMessage : function(){
			alert("Send a Message");
		},

		profile : function(event){

			var item = $(event.target).closest(".view-profile");
			var userGuid = $(item).attr("data-user");
			var job = $(item).closest("#candidates-list > li");
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
										el += "<div class='employment-date'>@ "+ this.employer.name +"</div>"
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
			var count = $(event.target).find("span").text();

			if(count > 0){
				var candidate = $(event.target).closest(".view-profile");
				var name = $(candidate).find(".candidate-info .candidate-name").text();
				localStorage.setItem("HSSharedConnectionName", name);
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