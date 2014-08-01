define([
		"jquery",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-layout-app"
	],
	function($, App, Utils, Marionette, Template){
		"use strict";

		var LayoutApp = Marionette.Layout.extend({
			tagName : "div",
			className : "app",
			template : Template,
			regions : {
				head : "#app-head",
				body : "#app-body"
			},
			
			events : {
				"click #primary-action"			: "primaryAction",
				"click #secondary-action"		: "secondaryAction",
				"click #close-help"				: "closeHelp",
				"click #accept-terms"			: "acceptTerms",
				"click #decline-terms"			: "declineTerms",
				"click #close-copy-link"		: "closeTinyURL",
				"click #close-referral-list"	: "closeCandidateReferral",
				"click #segmented-referrals"	: "showSegmentedReferrals",
				"click #segmented-pending"		: "showSegmentedPending",
				"click .google-hspost-help"		: "androidDevice",
				"click .ios-hspost-help"		: "iOSDevice",
				"click #close-share-job"		: "closeShareJob",
				"click #send-share-job"			: "sendShareJob"
			},

			initialize : function(){
				_.bindAll.apply(_, [this].concat(_.functions(this)));
				console.log("App layout initialized...");
			},

			onRender : function(){
				var device = this.detectDevice();
				if(device === "iOS"){
					$.get("terms-apple.html", function(data){
						$(".terms-and-conditions").html(data);
					});
				}else{
					$.get("terms.html", function(data){
						$(".terms-and-conditions").html(data);
					});	
				}
			},

			onShow : function(){
				var device = this.detectDevice();
				switch(device){
					case "iOS" :
						$("#google-play").remove();
					break;

					case "Android":
						$("#app-store").remove()
					break;
				}
			},

			detectDevice : function(){
				var agent = navigator.userAgent;

				if(agent.match(/Android/i)){
					return "Android";
				}else if(agent.match(/iPhone|iPad|iPod/i)){
					return "iOS";
				}else if(agent.match(/IEMobile/i)){
					return "WindowsMobile";
				}else{
					return "Unknown";
				}
			},

			androidDevice : function(){
				window.location = Utils.GetStoreLinks().google;
			},

			iOSDevice : function(){
				window.location = Utils.GetStoreLinks().apple;
			},

			primaryAction : function(){
				App.trigger("alertPrimaryAction");
			},

			secondaryAction : function(){
				App.trigger("alertSecondaryAction");
			},

			closeHelp : function(){
				Utils.HideHelp();
			},

			acceptTerms : function(){
				Utils.HideTermsAndConditions();
				$(document).find("#accept").prop("checked", true);
			},

			declineTerms : function(){
				Utils.HideTermsAndConditions();
				$(document).find("#accept").prop("checked", false);
			},

			closeTinyURL : function(){
				var alert = $("#app-alert-tinyurl");
				$(alert).removeClass("show");
				$(document).find("#app-modal").removeClass("show");
			},

			closeCandidateReferral : function(event){
				var alert = $("#app-alert-referral");
				$(alert).removeClass("show");
				$(document).find("#app-modal").removeClass("show");
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

			closeShareJob : function(){
				var alert = $("#app-alert-share-job");
				$(alert).removeClass("show");
				$(document).find("#app-modal").removeClass("show");
			},
			
			serializeData : function(){
				var jsonObject = new Object();
					jsonObject.language = App.Language;
				return jsonObject;
			}
		});

		return LayoutApp;
	}
);