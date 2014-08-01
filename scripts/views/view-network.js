define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-network"
	],
	function($, Cookie, App, Utils, Marionette, Template){
	"use strict";

	var ViewNetwork = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
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

			this.listenTo(App, "alertPrimaryAction", this.alertPrimaryAction);
			this.listenTo(App, "alertSecondaryAction", this.alertPrimaryAction);
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

		profile : function(event){
			
			var item = $(event.target).closest(".grid-list.top > li");
			var allItems = $(".grid-list.top > li");
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
			$(".candidate-select").prop("checked", false);
		},

		networkConnections : function(event){
			var count = $(event.target).find("span").text();

			if(count > 0){
				var candidate = $(event.target).closest(".view-profile");
				var guid = $(candidate).attr("data-guid");
				App.router.navigate("connections/"+guid, true);
			}

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

			$(".candidate-select:checked").each(function(){
				var guid = $(this).closest("li.view-profile").data("guid");
				userguids.push(guid);
			});

			var guids = userguids.join(",");
			var alert = $("#app-alert-share-job");
			$(alert).addClass("show");
			$(document).find("#app-modal").addClass("show");
			$(".candidate-select").prop("checked", false);
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.employees = this.model.employees;
				jsonObject.followers = this.model.followers;
				jsonObject.jobtypes = this.model.jobtypes;
				jsonObject.language = App.Language;
				jsonObject.breadcrumb = App.getTrail();
			return jsonObject;
		}
		
	});

	return ViewNetwork;
});