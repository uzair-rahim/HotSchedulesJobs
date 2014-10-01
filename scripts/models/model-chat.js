define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
		var Chat = Backbone.Model.extend({

			urlRoot : function(){
				return Utils.GetURL("/services/rest/chat");
			},
			
			url : function(){
				var url = this.urlRoot();
				return url;
			},

			initialize : function(){
				console.log("Chat model initialized...");
			},

			createChat : function(chat,callback){
				var that = this;
				var url = this.urlRoot();
				$.ajax({
					type : "POST",
					url : url,
					contentType : "application/json",
					data : JSON.stringify(chat),
					async : false,
					success : function(response){
						callback(response);
					},
					error : function(data){
						if(data.responseJSON.errorCode === 23){
							Utils.ShowToast({ type : "error", message : "Invalid message, please try again"})
						}
						console.log("Error creating chat");
					}
				});
			},

			getEmployerChats : function(employerGUID,callback){
				var that = this;
				var url = this.urlRoot() + "/employer/" + employerGUID +"?archived=0";
				$.ajax({
					type : "GET",
					url : url,
					success : function(response){
						callback(response);
					},
					error : function(){
						console.log("Error fetching employer chat list");
						Utils.HideQuickMessage();
					}
				});
			},

			getEmployerChat : function(employerGUID,chatGUID,callback){
				var that = this;
				var url = this.urlRoot() + "/" + chatGUID + "/employer/" + employerGUID;
				$.ajax({
					type : "GET",
					url : url,
					success : function(response){
						callback(response);
					},
					error : function(){
						console.log("Error fetching employer chat");
						Utils.HideQuickMessage();
					}
				});
			},

			updateChatMessageAsSeenByEmployer : function(chatGUID,callback){
				var that = this;
				var url = this.urlRoot() + "/" + chatGUID + "/messages/employer/seen";
				$.ajax({
					type : "PUT",
					url : url,
					asyn : false,
					success : function(response){
						callback(response);
					},
					error : function(){
						console.log("Error marking chat messages as seen by employer");
						Utils.HideQuickMessage();
					}
				});
			},

			addChat : function(chat,chatGUID,callback){
				var that = this;
				var url = this.urlRoot() + "/"+ chatGUID + "/message";
				$.ajax({
					type : "POST",
					url : url,
					contentType : "application/json",
					data : JSON.stringify(chat),
					async : false,
					success : function(response){
						callback(response);
					},
					error : function(data){
						if(data.responseJSON.errorCode === 23){
							Utils.ShowToast({ type : "error", message : "Invalid message, please try again"})
						}else{
							Utils.HideQuickMessage();	
						}
						console.log("Error sending reply to chat");
					}
				});
			}

		});

		return Chat;
	}
);