define([
		"jquery",
		"jquerycookie",
		"analytics",
		"app",
		"utils",
		"marionette",
		"scripts/models/model-chat",
		"hbs!templates/template-view-messages"
	],
	function($, Cookie, Analytics, App, Utils, Marionette, ModelChat, Template){
	"use strict";

	var ViewMessages = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #full-message-list > li"				: "showFullChatMessage",
			"click #full-message-view .message-head"	: "showFullChatList",
			"click #send-new-full-reply"				: "sendReply",
			"click .segmented-control .tab.unselected"	: "messageFolder"
			
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Messages view initialized...");
		},

		onShow : function(){
			ga('create', 'UA-52257201-1', 'hotschedulespost.com');
      		ga('send', 'pageview', '/messages');

			$(document).undelegate("#new-full-reply-text", "keyup");
			$(document).delegate("#new-full-reply-text", "keyup", function(event){
				var maxlength = 1000;						
				if ($(this).val().length > maxlength) {  
	            	$(this).val($(this).val().substring(0, maxlength));
	        	}
	        	var sendReplyButton = $(document).find("#send-new-full-reply");
	        	var replyText = $.trim($(this).val());
	        	if(replyText.length > 0){
	        		sendReplyButton.prop("disabled", false);
	        	}else{
	        		sendReplyButton.prop("disabled", true);
	        	}

	        	if(event.keyCode == 13){
					$("#send-new-full-reply").click();
				}

			});
		},

		showFullChatMessage : function(event){
				var that = this;
				var index = Utils.GetSelectedEmployer();
				var employerGUID = Utils.GetUserSession().employerIds[index];
				var chatGUID = $(event.target).closest("#full-message-list > li").attr("data-guid");
				var item = $(event.target).closest("#full-message-list > li");
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

		showFullChatList : function(event){
			var windowWidth = $(window).width();
				if(windowWidth <= 700){
					var fullMessages = $("#full-message-view");
						fullMessages.animate({scrollLeft : fullMessages.width() * (-1)}, 150);;
					var sendReplyButton = $(document).find("#send-new-full-reply");
						sendReplyButton.attr("data-guid", "");
					var textField = $("#new-full-reply-text");
						textField.val("");
				}
		},

		appendChatView : function(data,chatGUID){
			var template = '<div class="message-view-body">' + Utils.GetChatViewTemplate(data) + '</div><div class="message-view-foot"><input type="text" id="new-full-reply-text" placeholder="Message..."/><button class="primary" id="send-new-full-reply" disabled="true">Send</button></div>';
			var userName = "";
			var userWork = "";
			$.each(data.participants,function(){
				if(this.user !== null){
					userName = this.user.firstname + ' ' + this.user.lastname;
					if(this.user.primaryWorkHistory !== null){
						userWork = "- "+this.user.primaryWorkHistory.jobs[0].jobName+" @ "+this.user.primaryWorkHistory.employer.name;
					}
				}
			});
			
			var fullMessages = $("#full-message-view");
				fullMessages.find(".message-info-container").html('<div class="candidate-name">'+userName+'</div><div class="candidate-work">'+userWork+'</div>');
				fullMessages.find(".message-view-container").html(template);
				fullMessages.find(".message-view-container .message-view-body").scrollTop(fullMessages.find(".message-view-container .message-view-body").prop("scrollHeight"));
			var windowWidth = $(window).width();
				if(windowWidth <= 700){
					fullMessages.animate({scrollLeft : fullMessages.width()}, 150);;
				}	
			var sendReplyButton = $(document).find("#send-new-full-reply");
				sendReplyButton.attr("data-guid", chatGUID);
		},

		updateChatView : function(data){
			var template = Utils.GetChatMessageTemplate(data);
			var fullMessages = $("#full-message-view");
			fullMessages.find(".chat-list > li").removeClass("new");
			fullMessages.find(".chat-list").append(template);
			fullMessages.find(".message-view-container .message-view-body").scrollTop(fullMessages.find(".message-view-container .message-view-body").prop("scrollHeight"));
		},

		getEmployerChats : function(archived,updateView){
			var index = Utils.GetSelectedEmployer();
			var employerGUID = Utils.GetUserSession().employerIds[index];
			var chat = new ModelChat();
				chat.getEmployerChats(employerGUID, archived, 0, function(response){
					var fullMessages = $("#full-message-view");
					var fullMessagesBody = fullMessages.find(".messages-list");
					var folder = "inbox";
					if(archived){
						folder = "archived";
					}
					var template = Utils.GetChatListTemplate(response,folder);
					fullMessagesBody.html(template);
					if(updateView){
						var fullMessageInfo = $(".message-info-container");
							fullMessageInfo.html("");
						var fullMessageView = $(".message-view-container");
							fullMessageView.html('');
					}
				});
		},

		sendReply : function(event){
			var that = this;
			var sendButton = $(event.target);
			var chatGUID = sendButton.attr("data-guid");
			var textField = $("#new-full-reply-text");
				
			var message = new Object();
				message.sender = new Object();
				message.sender.guid = Utils.GetUserSession().guid;
				message.chatMessageContent = new Object();
				message.chatMessageContent.text = textField.val();
				message.employerSeen = new Object();
				message.employerSeen = true;
			
			var chat = new ModelChat();
				chat.addChat(message,chatGUID, function(response){
					that.updateChatView(response);
					that.getEmployerChats(0,false);
					textField.val("");
					sendButton.prop("disabled", true);
				});
		},

		messageFolder : function(event){
			$(".message-folder-container .segmented-control .tab").addClass("unselected");
			var tab = $(event.target);
				tab.removeClass("unselected");
			var archived = 0;
				if(tab.attr("id") === "archived-messages"){
					archived = 1;
				}

			var index = Utils.GetSelectedEmployer();
			var employerGUID = Utils.GetUserSession().employerIds[index];	
			this.getEmployerChats(archived,true);

		},		

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
				jsonObject.breadcrumb = App.getTrail();
				jsonObject.messageList = new Object();
				jsonObject.messageList = this.options.model;
			return jsonObject;
		}
		
	});

	return ViewMessages;
});


