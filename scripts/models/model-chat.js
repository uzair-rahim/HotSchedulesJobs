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
					error : function(){
						console.log("Error creating chat");
					}
				});
			},

			getEmployerChats : function(employerGUID,callback){
				var that = this;
				var url = this.urlRoot() + "/employer/" + employerGUID +"?archived=false";
				$.ajax({
					type : "GET",
					url : url,
					success : function(response){
						callback(response);
					},
					error : function(){
						console.log("Error fetching employer chat list");
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
					}
				});
			},

		});

		return Chat;
	}
);