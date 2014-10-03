define([
		"jquery",
		"jquerycookie",
		"analytics",
		"app",
		"utils",
		"marionette",
		"scripts/models/model-chat",
		"hbs!templates/template-view-messages-view"
	],
	function($, Cookie, Analytics, App, Utils, Marionette, ModelChat, Template){
	"use strict";

	var ViewMessageView = Marionette.ItemView.extend({
		tagName : "div",
		className : "message-view-container",
		template: Template,
		events : {
			"click #send-new-full-reply" : "sendReply"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Message view view initialized...");
		},

		onRender : function(){
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

			this.scrollToBottom();
		},

		scrollToBottom : function(){
			var messageBody = $(".message-view-container .message-view-body");
				messageBody.scrollTop($(messageBody).prop("scrollHeight"));
		},

		noMessage : function(){
			this.options.model.haveChats = false;
			this.render();
		},

		clearView : function(haveChats){
			this.options.model.haveChats = haveChats;
			this.options.model.chat = null;
			this.render();
		},

		sendReply : function(){
			var chatGUID = this.options.model.chat.guid;
			var employerGUID = Utils.GetUserSession().employerIds[Utils.GetSelectedEmployer()];
			var userGUID = Utils.GetUserSession().guid;
			var text = $("#new-full-reply-text").val();

			var message = new Object();
				message = {
					"sender" : {
						"guid" : userGUID
					},
					"chatMessageContent" : {
						"text" : text
					},
					"employerSeen" : true
				}

			var that = this;
			var chat = new ModelChat();
				chat.addChat(message,chatGUID,function(response){
					that.options.model.chat.messages.push(response);
					that.render();
				});
		},
		
		serializeData : function(){
			var jsonObject = new Object();
			jsonObject.haveChats = this.options.model.haveChats;
			jsonObject.chat = this.options.model.chat;
			return jsonObject;
		}
		
	});

	return ViewMessageView;
});


