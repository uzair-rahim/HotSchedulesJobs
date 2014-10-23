define([
		"jquery",
		"jquerycookie",
		"analytics",
		"app",
		"utils",
		"marionette",
		"scripts/models/model-chat",
		"scripts/views/view-messages-list",
		"scripts/views/view-messages-view",
		"hbs!templates/template-view-messages"
	],
	function($, Cookie, Analytics, App, Utils, Marionette, ModelChat, ViewMessagesList, ViewMessageView, Template){
	"use strict";

	var ViewMessages = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		messagesList : null,
		messagesListContainer : null,
		messageView : null,
		messageViewContainer : null,
		template: Template,
		events : {
			"click .segmented-control .tab.unselected"	: "selectMessagesFolder",
			"click #full-message-view .message-head"	: "showFullChatList"
		},

		initialize : function(){
			console.log("Messages view initialized...");
			_.bindAll.apply(_, [this].concat(_.functions(this)));
		},

		onShow : function(){
			ga('create', 'UA-52257201-1', 'hotschedulespost.com');
      		ga('send', 'pageview', '/messages');
      		this.appendMessagesList();
      		this.appendMessageView(this.options.model.length > 0,null);
		},

		appendMessagesList : function(){
			this.messagesList = new ViewMessagesList({model : this.options.model});
			this.messagesListContainer = $(document).find(".message-list-container");
			$(this.messagesListContainer).find(".messages-list").remove();
			this.messagesListContainer.append(this.messagesList.render().el);
			
			this.listenTo(this.messagesList,"selectChat",this.selectChat);
			this.listenTo(this.messagesList,"archiveChat",this.archiveChat);
			this.listenTo(this.messagesList,"unarchiveChat",this.unarchiveChat);
			this.listenTo(this.messagesList,"noMessage",this.noMessage);
		},

		appendMessageView : function(haveChats,chat){
			var chatModel = new Object();
				chatModel = {
					"haveChats" : haveChats,
					"chat" : chat
				}
			this.messageView = new ViewMessageView({model : chatModel});
			this.messageViewContainer = $(document).find(".message-body");
			$(this.messageViewContainer).find(".message-view-container").remove();
			this.messageViewContainer.append(this.messageView.render().el);
			this.messageView.scrollToBottom();
		},

		selectMessagesFolder : function(event){
			$(".message-folder-container .segmented-control .tab").addClass("unselected");
			var tab = $(event.target);
				tab.removeClass("unselected");

			var employerGUID = App.session.getEmployerGUID();
			var withRepliesOnly = 0;
			var archived = (tab.attr("id") === "inbox-messages") ? 0 : 1;
			
			var that = this;	
			var chat = new ModelChat();
				chat.getEmployerChats(employerGUID,archived,withRepliesOnly,function(response){
					that.options.model = response;
					that.appendMessagesList();
					that.updateMessageInfo("","");
					that.appendMessageView(that.options.model.length > 0, null);
				});	
		},

		selectChat : function(chatGUID,isNew,userName,userWork){
			ga("send", "event", "view-message", "click");
			var employerGUID = App.session.getEmployerGUID();
			var that = this;
			var chat = new ModelChat();
				chat.getEmployerChat(employerGUID,chatGUID,function(response){
					that.updateMessageInfo(userName,userWork);
					that.appendMessageView(true, response)
					var windowWidth = $(window).width();
						if(windowWidth <= 700){
							var fullMessages = $("#full-message-view");
								fullMessages.animate({scrollLeft : fullMessages.width()}, 150);;
						}
						if(isNew){
							chat.updateChatMessageAsSeenByEmployer(chatGUID,function(response){
								//
							});
						}
						

				});
		},

		showFullChatList : function(){
			var windowWidth = $(window).width();
			if(windowWidth <= 700){
				var fullMessages = $("#full-message-view");
					fullMessages.animate({scrollLeft : fullMessages.width() * (-1)}, 150);
			}
		},

		archiveChat : function(chatGUID,participantGUID){
			ga("send", "event", "archive-message", "click");
			var employerGUID = App.session.getEmployerGUID();
			var chatParticipant = new Object();
				chatParticipant = {
					"guid" : participantGUID,
					"archived" : true,
					"employer" : {
						"guid" : employerGUID
					}
				}
			var that = this;	
			var chat = new ModelChat();
				chat.updateChatParticipant(chatGUID,participantGUID,chatParticipant,function(response){
					that.updateMessageInfo("","");
					that.messagesList.removeChatFromList(chatGUID);
					that.messageView.clearView(that.messagesList.hasChats());
				});
		},

		unarchiveChat : function(chatGUID,participantGUID){
			ga("send", "event", "unarchive-message", "click");
			var employerGUID = App.session.getEmployerGUID();
			var chatParticipant = new Object();
				chatParticipant = {
					"guid" : participantGUID,
					"archived" : false,
					"employer" : {
						"guid" : employerGUID
					}
				}
			var that = this;	
			var chat = new ModelChat();
				chat.updateChatParticipant(chatGUID,participantGUID,chatParticipant,function(response){
					that.updateMessageInfo("","");
					that.messagesList.removeChatFromList(chatGUID);
					that.messageView.clearView(that.messagesList.hasChats());
				});
		},

		noMessage : function(){
			this.messageView.noMessage();
		},

		updateMessageInfo : function(userName,userWork){
			$(".message-info-container .candidate-name").text(userName);
			$(".message-info-container .candidate-work").text(userWork);
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
				jsonObject.breadcrumb = App.getTrail();
			return jsonObject;
		}
		
	});

	return ViewMessages;
});


