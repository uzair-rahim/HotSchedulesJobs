define([
		"jquery",
		"jqueryui",
		"analytics",
		"app",
		"utils",
		"marionette",
		"scripts/models/model-chat",
		"hbs!templates/template-layout-app"
	],
	function($, JQueryUI, Analytics, App, Utils, Marionette, ModelChat, Template){
		"use strict";

		var LayoutApp = Marionette.Layout.extend({
			tagName : "div",
			className : "app portal",
			template : Template,
			regions : {
				menu : "#app-menu",
				head : "#app-head",
				body : "#app-body"
			},
			
			events : {
				"click #primary-action"					: "primaryAction",
				"click #secondary-action"				: "secondaryAction",
				"click #close-help"						: "closeHelp",
				"click #accept-terms"					: "acceptTerms",
				"click #decline-terms"					: "declineTerms",
				"click #close-copy-link"				: "closeTinyURL",
				"click #close-referral-list"			: "closeCandidateReferral",
				"click #close-connections-list"			: "closeSharedConnections",
				"click #segmented-referrals"			: "showSegmentedReferrals",
				"click #segmented-pending"				: "showSegmentedPending",
				"click .google-hspost-help"				: "androidDevice",
				"click .ios-hspost-help"				: "iOSDevice",
				"click #close-share-job"				: "closeShareJob",
				"click #close-share-posted-job"			: "closeSharePostedJob",
				"click #send-share-posted-job"			: "sendSharePostedJob",
				"click #send-share-job"					: "sendShareJob",
				"click #save-logo"						: "saveLogo",
				"click #close-resize-logo"				: "closeResizeLogo",
				"click #close-endorsements-list"		: "closeEndorsements",
				"click #set-employer"					: "setEmployer",
				"click .send-message"					: "sendMessage",
				"click #send-new-message"				: "sendNewMessage",
				"click #cancel-new-message"				: "cancelNewMessage",
				"click #app-alert-new-message .pill"	: "removeRecipient",
				"click #see-all-messages"				: "seeAllMessages",
				"click #quick-message-list > li"		: "showQuickChatMessage",
				"click #quick-message-view #back"		: "showQuickChatList",
				"click #send-new-reply"					: "sendReply",
				"click #create-new-job"					: "createNewJob",
				"click #dismiss-new-job-request"		: "dismissNewJob",
				"click #app-head .icon" 				: "showHideMenu",
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

					$(document).undelegate("#new-reply-text", "keyup");
					$(document).delegate("#new-reply-text", "keyup", function(event){
						var maxlength = 1000;						
						if ($(this).val().length > maxlength) {  
	            			$(this).val($(this).val().substring(0, maxlength));
	        			}
	        			var sendReplyButton = $(document).find("#send-new-reply");
	        			var replyText = $.trim($(this).val());
	        			if(replyText.length > 0){
	        				sendReplyButton.prop("disabled", false);
	        			}else{
	        				sendReplyButton.prop("disabled", true);
	        			}

	        			$("#new-reply-text").keyup(function(event){
							if(event.keyCode == 13){
								$("#send-new-reply").click();
							}
						});
				});

			},

			showHideMenu : function(){
				var menu = $(document).find("#app-menu");
				var main = $(document).find("#app-main");
				var isVisible = $(menu).hasClass("show");
				if(isVisible){
					$(menu).removeClass("show");
					$(main).removeClass("collapse");
				}else{
					$(menu).addClass("show");
					$(main).addClass("collapse");
				}
			},

			hideMenu : function(){
				var menu = $(document).find("#app-menu");
				var main = $(document).find("#app-main");
				$(menu).removeClass("show");
				$(main).removeClass("collapse");
			},

			showHideNotifications : function(){
				var notifications = $(document).find("#app-notifications");
				var isVisible = $(notifications).hasClass("show");
				if(isVisible){
					$(notifications).removeClass("show");
				}else{
					$(notifications).addClass("show");
				}
			},

			hideNotifications : function(){
				var notifications = $(document).find("#app-notifications");
				$(notifications).removeClass("show");
			},

			toggleLayout : function(state){
				var app = $(document).find(".app");
				switch(state){
					case "app":
						$(app).removeClass("portal");
					break;
					case "portal":
						$(app).addClass("portal");
					break;
				}

				// Hide the notification flyout
				var notifications = $(document).find("#app-notifications");
				$(notifications).removeClass("show");
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
				this.options.app.trigger("alertPrimaryAction");
			},

			secondaryAction : function(){
				this.options.app.trigger("alertSecondaryAction");
			},

			sendShareJob : function(){
				this.options.app.trigger("sendShareJob");
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
				this.options.app.router.controller.jobs();
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
					share.employer.guid = App.router.controller.getEmployerGUID();

					var that = this;
					var restURL = Utils.GetURL("/services/rest/share");

				if(toCurrentEmployees){
					ga("send", "event", "shared-job", "click", "employees");
					share.type = 1;
					deferred.push(
						$.ajax({
							 headers: { 
						        'Accept': 'application/json',
						        'Content-Type': 'application/json' 
						    },
							url : restURL,
							type : "POST",
							async : false,
							data: JSON.stringify(share),
			    			processData: false,
			    			error : function(response){
			    				Utils.ShowToast({message : "Error sharing job with employees"});
			    			}
						})
					);
				}

				if(toFollowers){
					ga("send", "event", "shared-job", "click", "followers");
					share.type = 2;
					deferred.push(
						$.ajax({
							 headers: { 
						        'Accept': 'application/json',
						        'Content-Type': 'application/json' 
						    },
							url : restURL,
							type : "POST",
							async : false,
							data: JSON.stringify(share),
			    			processData: false,
			    			error : function(response){
			    				Utils.ShowToast({message : "Error sharing job with followers"});
			    			}
						})
					);
				}

				if(toConnections){
					ga("send", "event", "shared-job", "click", "connections");
					share.type = 3;
					deferred.push(
						$.ajax({
							 headers: { 
						        'Accept': 'application/json',
						        'Content-Type': 'application/json' 
						    },
							url : restURL,
							type : "POST",
							async : false,
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
				this.options.app.router.navigate("jobs", true);
			},

			sendMessage : function(event){
				var email = $(event.target).attr("data-email");
				window.open("mailto:"+email);
			},

			sendNewMessage : function(){
				var recipients = Utils.GetNewMessageRecipients();
				var message = $.trim($("#new-message-text").val());
				if(recipients.length === 0){
					Utils.ShowToast({type : "error", message : "Must select at least one recipient"});
				}else if(message === ""){
					Utils.ShowToast({type : "error", message : "Message cannot be empty"});
				}else{
					var employerGUID = App.router.controller.getEmployerGUID();
					var users = Utils.GetNewMessageRecipients();

					var dataArray = new Array();

					$.each(users,function(){
						var data = new Object();
							data.participants = new Array();
							data.messages = new Array();

						var user = new Object();
							user = { "user" : { guid : this} };
							data.participants.push(user);

						var employer = new Object();
							employer = { "employer" : {guid : employerGUID} };
							data.participants.push(employer);

						var message = new Object();
							message.sender = new Object();
							message.sender.guid = App.session.get("guid");
							message.chatMessageContent = new Object();
							message.chatMessageContent.text = $("#new-message-text").val();
							message.employerSeen = new Object();
							message.employerSeen = true;	

						data.messages.push(message);	
						dataArray.push(data);

					});
					
					var chat = new ModelChat();
						chat.createChat(dataArray, function(response){
							Utils.ShowToast({type : "success", message : "Message sent successfully"});
						});

					Utils.HideSendNewMessage();
					Utils.RemoveAllRecipientFromNewMessage();
					Utils.RemoveJobPostingGUID();
					$("#new-message-text").val("");
				}
			},

			cancelNewMessage : function(){
				Utils.HideSendNewMessage();
				Utils.RemoveAllRecipientFromNewMessage();
				$("#new-message-text").val("");
			},

			removeRecipient : function(event){
				var index = $(event.target).index() - 1;
				Utils.RemoveRecipientFromNewMessage(index);
				$(event.target).remove();
			},

			seeAllMessages : function(){
				ga('send', 'event', 'button', 'click', 'see all messages');
				Utils.HideQuickMessage();
				this.options.app.router.navigate("messages", true);
			},

			showQuickChatMessage : function(event){
				var that = this;
				var employerGUID = App.router.controller.getEmployerGUID();
				var chatGUID = $(event.target).closest("#quick-message-list > li").attr("data-guid");
				var item = $(event.target).closest("#quick-message-list > li");
				var isUnseen = item.hasClass("new");
				var chat = new ModelChat();
					chat.getEmployerChat(employerGUID,chatGUID,function(response){
						that.appendChatView(response,chatGUID);
						if(isUnseen){
							chat.updateChatMessageAsSeenByEmployer(chatGUID, function(response){
								item.removeClass("new");
							});	
						}
					});
			},

			showQuickChatList : function(){
				var quickMessages = $("#quick-message-view");
					quickMessages.find(".mask").animate({scrollLeft : quickMessages.width() * (-1)}, 150);
				var sendReplyButton = $(document).find("#send-new-reply");
					sendReplyButton.attr("data-guid", "");
				var textField = $("#new-reply-text");
					textField.val("");	
			},

			sendReply : function(event){
				var that = this;
				var sendButton = $(event.target);
				var chatGUID = sendButton.attr("data-guid");
				var textField = $("#new-reply-text");
				
				var message = new Object();
					message.sender = new Object();
					message.sender.guid = App.session.get("guid");
					message.chatMessageContent = new Object();
					message.chatMessageContent.text = textField.val();
					message.employerSeen = new Object();
					message.employerSeen = true;
			
				var chat = new ModelChat();
					chat.addChat(message,chatGUID, function(response){
						that.updateChatView(response);
						that.getEmployerChats();
						textField.val("");
						sendButton.prop("disabled", true);
					});
			},

			getEmployerChats : function(){
				var employerGUID = App.router.controller.getEmployerGUID();
				var chat = new ModelChat();
					chat.getEmployerChats(employerGUID, 0, 1, function(response){
						var dialog = $(document).find("#quick-message-view");
						var dialogBody = dialog.find(".inbox .dialog-body");
						var template = Utils.GetChatListTemplate(response,"inbox");
						dialogBody.html(template);
						Utils.ShowQuickMessage();
					});
			},

			appendChatView : function(data,chatGUID){
				var template = Utils.GetChatViewTemplate(data);
				var quickMessages = $("#quick-message-view");
					$.each(data.participants,function(){
						if(this.user !== null){
							quickMessages.find(".chat .dialog-head").text(this.user.firstname + " " + this.user.lastname);	
						}
					});
					
					quickMessages.find(".mask").animate({scrollLeft : quickMessages.width()}, 150);
					quickMessages.find(".chat .dialog-body").html(template);
					quickMessages.find(".chat .dialog-body").scrollTop(quickMessages.find(".chat .dialog-body").prop("scrollHeight"));
				var sendReplyButton = $(document).find("#send-new-reply");
					sendReplyButton.attr("data-guid", chatGUID);
			},

			updateChatView : function(data){
				var template = Utils.GetChatMessageTemplate(data);
				var quickMessages = $("#quick-message-view");
				quickMessages.find(".chat .dialog-body .chat-list > li").removeClass("new");
				quickMessages.find(".chat .dialog-body .chat-list").append(template);
				quickMessages.find(".chat .dialog-body").scrollTop(quickMessages.find(".chat .dialog-body").prop("scrollHeight"));
			},

			createNewJob : function(){
				var addNewJobButton = $(document).find("#add-new-job");
					addNewJobButton.click();
					this.dismissNewJob();
			},

			dismissNewJob : function(){
				var alertDialog = $(document).find("#app-alert-new-job-request");
					alertDialog.removeClass("show");
				$(document).find(".view-modal").remove();
			},

			serializeData : function(){
				var jsonObject = new Object();
					jsonObject.language = this.options.app.Language;
				return jsonObject;
			}
		});

		return LayoutApp;
	}
);