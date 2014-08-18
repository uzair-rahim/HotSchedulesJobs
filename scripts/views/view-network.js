define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-network",
		"scripts/models/model-user"
	],
	function($, Cookie, App, Utils, Marionette, Template, ModelUser){
	"use strict";

	var ViewNetwork = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		employeesGuids : null,
		followersGuids : null,
		events : {
			"click #filter"				: "showFilter",
			"click #cancel-filter"		: "hideFilter",
			"click #search-filter"		: "searchFilter",
			"click #clear"				: "clearAllFilter",
			"click .view-profile"		: "profile",
			"click .candidate-select"	: "networkSelect",
			"click .candidate-message"	: "networkMessage",
			"click #send-message"		: "sendBulkMessage",
			"click .candidate-network"	: "networkConnections",
			"click #share-job"			: "shareJob"

		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Network view initialized...");

			// NEW selector
			$.expr[':'].Contains = function(a, i, m) {
			  return jQuery(a).text().toUpperCase()
			      .indexOf(m[3].toUpperCase()) >= 0;
			};

			// OVERWRITES old selector
			$.expr[':'].contains = function(a, i, m) {
			  return jQuery(a).text().toUpperCase()
			      .indexOf(m[3].toUpperCase()) >= 0;
			};			

			this.listenTo(App, "sendShareJob", this.sendShareJob);
		},

		onShow : function(){

			var jobs = this.model.jobsinfo;

			if(jobs.length > 0){
				var shareJobsButton = $("#select-share-job button");
				var shareJobsList = $("#select-share-job .custom-select-list");
				
				$(shareJobsButton).text(jobs[0].attributes.jobName);
				$(shareJobsList).html("");
				
				for(var i = 0; i < jobs.length; i++){
					$(shareJobsList).append("<li>"+jobs[i].attributes.jobName+"</li>");
				}
			}

		},

		profile : function(event){

			var item = $(event.target).closest(".grid-list.top > li");
			var userGuid = $(item).attr("data-guid");
			var profile = $(item).find(".hourly-profile");
			var isProfileExpanded = $(profile).hasClass("show");
			var allProfiles = $(".hourly-profile");
			var allItems = $(".grid-list.top > li");

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
										el += "<div class='employment-date'>"+ this.startDate + " - " +this.endDate +"</div>"
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
				});

			}else{
				$(item).removeClass("expanded");
				$(allItems).removeClass("faded");	
				$(allProfiles).removeClass("show");
			}

			event.stopPropagation();
		},

		networkSelect : function(event){
			var count = $(".candidate-select:checked").length;
			if(count > 0){
				$("#send-message").prop("disabled",false);
				$("#share-job").prop("disabled",false);
			}else{
				$("#send-message").prop("disabled",true);
				$("#share-job").prop("disabled",true);
			}
			event.stopPropagation();
		},

		networkMessage : function(event){
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

			this.disableToolbarButtons();
		},

		networkConnections : function(event){
			var candidate = $(event.target).closest(".view-profile");
			var name = $(candidate).find(".candidate-info .candidate-name").text();
			localStorage.setItem("HSSharedConnectionName", name);
			var guid = $(candidate).attr("data-guid");
			App.router.navigate("connections/"+guid, true);
			event.stopPropagation();
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

			var employeesList = $("#employees-list");
			var followersList = $("#followers-list");

			var isCheckboxSelected = $(checkboxes).length > 0;

			if(!isCheckboxSelected){
				$(employeesList).find(".view-profile").show();
				$(followersList).find(".view-profile").show();
			}else{

				$(employeesList).find(".view-profile").hide();
				$(followersList).find(".view-profile").hide();

				$(checkboxes).each(function(){
					var jobname = $(this).next().text();
						$(employeesList).find(".candidate-job:Contains('"+jobname+"')").closest(".view-profile").show();
						$(followersList).find(".candidate-job:Contains('"+jobname+"')").closest(".view-profile").show();
				});

			}

			$(employeesList).prev().text("Current Employees ("+$(employeesList).find(".view-profile:visible").length+")");
			$(followersList).prev().text("People Following Your Business ("+$(followersList).find(".view-profile:visible").length+")");

			this.hideFilter();
		},

		clearAllFilter : function(){
			$(".filter-section .checkbox-group input").prop("checked", false);
		},

		shareJob : function(event){
			var userguids = [];
			var employeesGuids = [];
			var followersGuids = [];

			$(".candidate-select:checked").each(function(){
				var guid = $(this).closest("li.view-profile").data("guid");
				var list = $(this).closest("ul.grid-list");
				var network = $(list).attr("id");

				if(network === "followers-list"){
					followersGuids.push(guid);
				}else if(network === "employees-list"){
					employeesGuids.push(guid);
				}

			});

			this.employeesGuids = employeesGuids;
			this.followersGuids = followersGuids;

			var alert = $("#app-alert-share-job");
			$(alert).addClass("show");
			$(document).find("#app-modal").addClass("show");

		},

		sendShareJob : function(){
			var index = Utils.GetSelectedEmployer();
			var jobIndex = $("#select-share-job").attr("data-index");
			var jobGuid = this.model.jobsinfo[jobIndex].attributes.guid;
			var employeeGuids = this.employeesGuids;
			var followerGuids = this.followersGuids;

			var share = new Object();
				share.fromUser = new Object();
				share.jobPosting = new Object();
				share.employer = new Object();

				share.fromUser.guid = Utils.GetUserSession().guid;
				share.employer.guid = Utils.GetUserSession().employerIds[index];
				share.jobPosting.guid = jobGuid
				share.toEmployeeGuids = employeeGuids;
				share.toFollowerGuids = followerGuids;

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
	    		success : function(){
	    			Utils.ShowToast({message : "Job Shared with your network"});
	    		},
	    		error : function(response){
	    			Utils.ShowToast({message : "Error sharing job"});
	    		}
			});

			this.disableToolbarButtons();
			var alert = $("#app-alert-share-job");
				$(alert).removeClass("show");
		},

		disableToolbarButtons : function(){
			$(".candidate-select").prop("checked", false);
			$("#share-job").prop("disabled", true);
			$("#send-message").prop("disabled", true);
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.employees = this.model.employees;
				jsonObject.followers = this.model.followers;
				jsonObject.endorsements = this.model.endorsements;
				jsonObject.jobtypes = this.model.jobtypes;
				jsonObject.language = App.Language;
				jsonObject.breadcrumb = App.getTrail();
			return jsonObject;
		}
		
	});

	return ViewNetwork;
});