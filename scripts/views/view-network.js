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
			var candidate = $(event.target).closest(".view-profile");
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
			this.hideFilter();
		},

		clearAllFilter : function(){
			$(".filter-section .checkbox-group input").prop("checked", false);
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.network = this.model.network;
				jsonObject.jobtypes = this.model.jobtypes;
				jsonObject.language = App.Language;
				jsonObject.breadcrumb = App.getTrail();

				console.log(jsonObject);

			return jsonObject;
		}
		
	});

	return ViewNetwork;
});