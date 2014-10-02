define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-nav",
		"scripts/models/model-chat"
	],
	function($, Cookie, App, Utils, Marionette, Template, ModelChat){
	"use strict";

	var ViewNav = Marionette.ItemView.extend({
		tagName : "div",
		className : "navigation",
		template: Template,
		events : {
			"click #nav-button" 		: "showMenu",
			"click #jobs" 				: "jobs",
			"click #candidates" 		: "candidates",
			"click #network" 			: "network",
			"click #messages" 			: "quickMessages",
			"click #settings" 			: "settings",
			"click #account-settings" 	: "accountSettings",
			"click #profile-settings" 	: "profileSettings",
			"click #stores-list" 		: "switchStore",
			"click #terms-conditions" 	: "termsAndCondition",
			"click #logout" 			: "logout"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Nav view initialized...");
		},

		onShow : function(options){
			var tab = "jobs";
			if(typeof this.options.tab !== "undefined"){
				tab = this.options.tab
			}

			$("#nav-button").text(tab);

			$(document).on("click", function(event){
				var element = $(event.target).attr("id");
				var windowWidth = $(window).width();
				if(element !== "nav-button" && windowWidth <= 600){
					$("#nav-menu").css("display", "none");
				}

				if(element !== "settings"){
					$("#settings-flyout").css("display", "none");
				}
			});

			$(window).on("resize", function(){
				var windowWidth = $(window).width();
				if(windowWidth > 600){
					$("#nav-menu").css("display", "block");	
				}else{
					$("#nav-menu").css("display", "none");	
				}
			});

			var selectedStoreIndex = Utils.GetSelectedEmployer();
			$("#stores-list li").removeClass("selected");
			$("#stores-list li:eq("+selectedStoreIndex+")").addClass("selected");
		},

		showMenu : function(){
			$("#nav-menu").css("display", "block");
		},

		jobs : function(){
			this.route("jobs");
		},

		candidates : function(){
			this.route("candidates");
		},

		network : function(){
			this.route("network");
		},

		quickMessages : function(){
			var route = Backbone.history.fragment;
			var windowWidth = $(window).width();
			if(route == "messages" || windowWidth <= 700){
				this.route("messages");
			}else{
				if(Utils.IsQuickMessageVisible()){
					Utils.HideQuickMessage();	
				}else{
					this.getEmployerChats();
				}
			}
		},

		getEmployerChats : function(){
			var index = Utils.GetSelectedEmployer();
			var employerGUID = Utils.GetUserSession().employerIds[index];
			var chat = new ModelChat();
				chat.getEmployerChats(employerGUID, 0, 1, function(response){
					var dialog = $(document).find("#quick-message-view");
					var dialogBody = dialog.find(".inbox .dialog-body");
					var template = Utils.GetChatListTemplate(response,"inbox");
					dialogBody.html(template);
					Utils.ShowQuickMessage();
				});
		},

		settings : function(){
			var settings = $("#settings-flyout");
			var isVisible = $(settings).css("display") == "block"
			if(isVisible){
				$(settings).hide();
			}else{
				$(settings).show();
			}
		},

		accountSettings : function(){
			this.route("accountSettings");
		},

		profileSettings : function(){
			this.route("profileSettings");
		},

		switchStore : function(event){
			var index = $(event.target).index();
			if(index !== Utils.GetSelectedEmployer()){
				Utils.SetSelectedEmployer(index);
				this.route("jobs");
			}
		},

		termsAndCondition : function(){
			Utils.ShowTermsAndConditions({inApp : true, secondaryButtonText : "OK"});
		},

		logout : function(){
			App.router.navigate("logout", true);
		},

		route : function(fragment){
			if(Backbone.history.fragment === fragment){
				Backbone.history.loadUrl();
			}else{
				App.router.navigate(fragment, true);
			}
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.username = Utils.GetUserSession().firstname + " " + Utils.GetUserSession().lastname;
				jsonObject.employers = Utils.GetAdminEmployers();
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewNav;
});