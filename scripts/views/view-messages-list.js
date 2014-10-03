define([
		"jquery",
		"jquerycookie",
		"analytics",
		"app",
		"utils",
		"marionette",
		"scripts/models/model-chat",
		"hbs!templates/template-view-messages-list"
	],
	function($, Cookie, Analytics, App, Utils, Marionette, ModelChat, Template){
	"use strict";

	var ViewMessagesList = Marionette.ItemView.extend({
		tagName : "div",
		className : "messages-list",
		template: Template,
		events : {
			"click #full-message-list > li" : "selectChat",
			"click .archive-message"		: "archiveChat",
			"click .unarchive-message"		: "unarchiveChat",
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Messages list view initialized...");
		},

		selectChat : function(event){
			var chat = $(event.target).closest("li");
			var chatGUID = chat.data("guid");
			var userName = chat.find(".candidate-profile").html();
			var userWork = chat.find(".candidate-profile span").text()
			var index = userName.indexOf("<span>");
				userName = (index !== -1) ? userName.substring(0,index) : userName;
			this.trigger("selectChat",chatGUID,userName.trim(),userWork);
		},

		archiveChat : function(event){
			var chat = $(event.target).closest("li");
			var chatGUID = chat.data("guid");
			var participantGUID = $(event.target).data("guid")
			this.trigger("archiveChat",chatGUID,participantGUID);
			event.stopPropagation();
		},

		unarchiveChat : function(event){
			var chat = $(event.target).closest("li");
			var chatGUID = chat.data("guid");
			var participantGUID = $(event.target).data("guid")
			this.trigger("unarchiveChat",chatGUID,participantGUID);
			event.stopPropagation();
		},

		removeChatFromList : function(chatGUID){
			$("#full-message-list").find("li[data-guid='"+chatGUID+"']").remove();
			if($("#full-message-list li").length === 0){
				$("#full-message-list").remove();
				
				if($("#inbox-messages").hasClass("unselected")){
					$(".messages-list").html("<div class='empty-body'>No Archived Messages</div>");
				}else{
					$(".messages-list").html("<div class='empty-body'>No Messages</div>")
				}
				
				this.trigger("noMessage");
			}
		},

		hasChats : function(){
			return $("#full-message-list li").length > 0;
		},
		
		serializeData : function(){
			var jsonObject = new Object();
			jsonObject.messageList = new Object();
			jsonObject.messageList = this.options.model;
			return jsonObject;
		}
		
	});

	return ViewMessagesList;
});


