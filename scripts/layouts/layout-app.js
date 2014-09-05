define([
		"jquery",
		"jqueryui",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-layout-app"
	],
	function($, JQueryUI, App, Utils, Marionette, Template){
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
				"click #primary-action"				: "primaryAction",
				"click #secondary-action"			: "secondaryAction",
				"click #close-help"					: "closeHelp",
				"click #accept-terms"				: "acceptTerms",
				"click #decline-terms"				: "declineTerms",
				"click #close-copy-link"			: "closeTinyURL",
				"click #close-referral-list"		: "closeCandidateReferral",
				"click #close-connections-list"		: "closeSharedConnections",
				"click #segmented-referrals"		: "showSegmentedReferrals",
				"click #segmented-pending"			: "showSegmentedPending",
				"click .google-hspost-help"			: "androidDevice",
				"click .ios-hspost-help"			: "iOSDevice",
				"click #close-share-job"			: "closeShareJob",
				"click #close-share-posted-job"		: "closeSharePostedJob",
				"click #send-share-posted-job"		: "sendSharePostedJob",
				"click #send-share-job"				: "sendShareJob",
				"click #save-logo"					: "saveLogo",
				"click #close-resize-logo"			: "closeResizeLogo",
				"click #close-endorsements-list"	: "closeEndorsements",
				"click #set-employer"				: "setEmployer",
				"click .send-message"				: "sendMessage"
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

				
				var containerWidth = $(".resize-logo-container").width();
				var containerHeight = $(".resize-logo-container").height();

				var imageScale = 0;
				var handle = $(".resize-slider-container .slider .handle");
					$(handle).draggable({
						axis: "x",
						containment: "parent",
						start : function(event, ui){
							$(".resize-logo-image").css({top : 0, left: 0});
						},
						drag : function(event, ui){
							imageScale = ((((ui.position.left - 75)/126)*100)+100) + "%";
							$(".resize-logo-image").css("width", imageScale);
						},
						stop : function(){
							$(".resize-logo-image").draggable("destroy");

							var imagePosition = $(".resize-logo-image").offset();
							var imageWidth = $(".resize-logo-image").width();
							var imageHeight = $(".resize-logo-image").height();
							
							var x1 = (imagePosition.left + containerWidth) - imageWidth;
							var y1 = (imagePosition.top + containerHeight) - imageHeight;
							var x2 = imagePosition.left;
							var y2 = imagePosition.top;

							$(".resize-logo-image").draggable({containment : [x1,y1,x2,y2]});
						}
					});
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

			sendShareJob : function(){
				App.trigger("sendShareJob");
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
				var alertDialog = $("#app-alert-referrals");
					alertDialog.removeClass("show");
				var app = $(document).find(".app");
					app.find(".view-modal").remove();
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

			closeSharedConnections : function(event){
				var alertDialog = $("#app-alert-shared-connections");
					alertDialog.removeClass("show");
				var app = $(document).find(".app");
					app.find(".view-modal").remove();

			},

			closeEndorsements : function(event){
				var alertDialog = $("#app-alert-endorsements");
					alertDialog.removeClass("show");
				var app = $(document).find(".app");
					app.find(".view-modal").remove();

			},

			closeResizeLogo : function(event){
				var alert = $("#app-alert-resize-logo");
				$(alert).removeClass("show");
				$(document).find("#app-modal").removeClass("show");
				$("#app-alert-resize-logo img.resize-logo-image").remove();
				$(".resize-slider-container .slider .handle").css("left", 75);
			},

			closeShareJob : function(){
				var alertDialog = $("#app-alert-share-job");
				$(alertDialog).removeClass("show");
				$(document).find("#app-modal").removeClass("show");
			},

			closeSharePostedJob : function(){
				var alertDialog = $("#app-alert-share-posted-job");
					alertDialog.attr("data-job", "");
				$(alertDialog).removeClass("show");
				$(document).find(".view-modal").remove();
				App.router.controller.jobs();
			},

			sendSharePostedJob : function(){
				var alertDialog = $("#app-alert-share-posted-job");
				var jobGUID = alertDialog.attr("data-job");
			
				var toCurrentEmployees = $("#share-posted-current-employees").prop("checked");
				var toConnections = $("#share-posted-connections").prop("checked");
				var toFollowers = $("#share-posted-followers").prop("checked");

				this.closeSharePostedJob();

				var deferred = [];

				var index = Utils.GetSelectedEmployer();
					var share = new Object();
					share.fromUser = new Object();
					share.jobPosting = new Object();
					share.employer = new Object();
					
					share.fromUser.guid = Utils.GetUserSession().guid;
					share.jobPosting.guid = jobGUID;
					share.employer.guid = Utils.GetUserSession().employerIds[index];

					var that = this;
					var restURL = Utils.GetURL("/services/rest/share");

				if(toCurrentEmployees){
					share.type = 1;
					deferred.push(
						$.ajax({
							 headers: { 
						        'Accept': 'application/json',
						        'Content-Type': 'application/json' 
						    },
							url : restURL,
							type : "POST",
							data: JSON.stringify(share),
			    			processData: false,
			    			error : function(response){
			    				Utils.ShowToast({message : "Error sharing job with employees"});
			    			}
						})
					);
				}

				if(toFollowers){
					share.type = 2;
					deferred.push(
						$.ajax({
							 headers: { 
						        'Accept': 'application/json',
						        'Content-Type': 'application/json' 
						    },
							url : restURL,
							type : "POST",
							data: JSON.stringify(share),
			    			processData: false,
			    			error : function(response){
			    				Utils.ShowToast({message : "Error sharing job with followers"});
			    			}
						})
					);
				}

				if(toConnections){
					var connections = Utils.GetUserConnectionsList();
					share.type = 0;
					share.toUserGuids = connections;
					deferred.push(
						$.ajax({
							 headers: { 
						        'Accept': 'application/json',
						        'Content-Type': 'application/json' 
						    },
							url : restURL,
							type : "POST",
							data: JSON.stringify(share),
			    			processData: false,
			    			error : function(response){
			    				Utils.ShowToast({message : "Error sharing job with connections"});
			    			}
						})
					);
				}

				$.when.apply($, deferred).done(function(){
					if(toCurrentEmployees || toFollowers){
						Utils.ShowToast({ type : "success", message : "Job shared successfully"})
					}
				});

			},

			setEmployer : function(){
				var alertDialog = $(document).find("#app-alert-select-employer");
				var index = $(alertDialog).find(".custom-select").attr("data-index");
				Utils.SetSelectedEmployer(index);
				$(alertDialog).removeClass("show");
				$(alertDialog).find(".custom-select-list").html("");
				$(alertDialog).find(".custom-select").attr("data-index", 0);
				App.router.navigate("jobs", true);
			},

			sendMessage : function(event){
				var email = $(event.target).attr("data-email");
				window.location.href = "mailto:"+email;
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