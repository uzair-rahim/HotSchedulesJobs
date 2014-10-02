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
			"click .segmented-control .tab.unselected" : "selectMessagesFolder"
		},

		initialize : function(){
			console.log("Messages view initialized...");
			_.bindAll.apply(_, [this].concat(_.functions(this)));
		},

		onShow : function(){
			ga('create', 'UA-52257201-1', 'hotschedulespost.com');
      		ga('send', 'pageview', '/messages');
      		this.appendMessagesList();
      		this.appendMessageView();
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
			var haveChats = typeof numberOfChats === "undefined" ? false : false;
			var chat = typeof chat === "undefined" ? null : null;
			var chatModel = new Object();
				chatModel = {
					"haveChats" : haveChats,
					"chats" : chat
				}
			this.messageView = new ViewMessageView({model : chatModel});
			this.messageViewContainer = $(document).find(".message-body");
			$(this.messageViewContainer).find(".message-view-container").remove();
			this.messageViewContainer.append(this.messageView.render().el);
		},

		selectMessagesFolder : function(event){
			$(".message-folder-container .segmented-control .tab").addClass("unselected");
			var tab = $(event.target);
				tab.removeClass("unselected");

			var employerGUID = Utils.GetUserSession().employerIds[Utils.GetSelectedEmployer()];
			var withRepliesOnly = 0;
			var archived = (tab.attr("id") === "inbox-messages") ? 0 : 1;
			
			var that = this;	
			var chat = new ModelChat();
				chat.getEmployerChats(employerGUID,archived,withRepliesOnly,function(response){
					that.options.model = response;
					that.appendMessagesList();
				});	
		},

		selectChat : function(chatGUID){
			var employerGUID = Utils.GetUserSession().employerIds[Utils.GetSelectedEmployer()];
			var that = this;
			var chat = new ModelChat();
				chat.getEmployerChat(employerGUID,chatGUID,function(response){
					console.log(response);
					that.appendMessageView(that.options.model.length, response)
				});
		},

		archiveChat : function(chatGUID,participantGUID){
			var employerGUID = Utils.GetUserSession().employerIds[Utils.GetSelectedEmployer()];
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
					that.messagesList.removeChatFromList(chatGUID);
				});
		},

		unarchiveChat : function(chatGUID,participantGUID){
			var employerGUID = Utils.GetUserSession().employerIds[Utils.GetSelectedEmployer()];
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
					that.messagesList.removeChatFromList(chatGUID);
				});
		},

		noMessage : function(){
			alert("No Message");
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


