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
			"click .candidate-network"	: "networkConnections",

		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Network view initialized...");
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
			event.stopPropagation();
		},

		networkMessage : function(event){
			alert("Send Message");
			event.stopPropagation();
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
			var employeesCheckbox = $(flyout).find("#current-employees:checked");
			var followersCheckbox = $(flyout).find("#business-followers:checked");
			var isCheckboxSelected = $(checkboxes).length > 0;
			var isEmployeesCheckboxSelected = employeesCheckbox.length > 0;
			var isFollowersCheckboxSelected = followersCheckbox.length > 0;

			var currentEmployees = $("#employees-list-container");
			var businessFollowers = $("#followers-list-container");

			$(currentEmployees).hide();
			$(businessFollowers).hide();

			if(isEmployeesCheckboxSelected){
				$(currentEmployees).show();
			}

			if(isFollowersCheckboxSelected){
				$(businessFollowers).show();
			}

			if(!isCheckboxSelected && !isEmployeesCheckboxSelected && !isFollowersCheckboxSelected){
				$(currentEmployees).show();
				$(businessFollowers).show();
			}


			this.hideFilter();
		},

		clearAllFilter : function(){
			$(".filter-section .checkbox-group input").prop("checked", false);
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