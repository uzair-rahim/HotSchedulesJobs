define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
		var Network = Backbone.Model.extend({

			urlRoot : function(){
				return Utils.GetURL("/services/rest/network");
			},
			
			url : function(){
				var url = this.urlRoot();
				return url;
			},

			initialize : function(){
				console.log("Network model initialized...");
			},

			getSharedConnections : function(guid1,guid2,callback){
				var that = this;
				var url = this.urlRoot()+"/shared?user1Guid="+guid1+"&user2Guid="+guid2;
				$.ajax({
					type : "GET",
					url : url,
					success : function(response){
						callback(response);
					},
					error : function(){
						console.log("Error fetching shared connections");
						Utils.ShowToast({message : "Error fetching shared connections"});
					}
				});
			},

			createConnection : function(connections, callback){
				var that = this;
				var guid = this.attributes.guid;
				var url = this.urlRoot();
				$.ajax({
					data : JSON.stringify(connections),
					type : "POST",
					contentType : "application/json",
					url : url,
					success : function(response){
						callback(response);
					},
					error : function(){
						console.log("Error create connection");
						Utils.ShowToast({message : "Error create connection"});
					}
				});
			},

			deleteConnection : function(connections, callback){
				var that = this;
				var guid = this.attributes.guid;
				var url = this.urlRoot() + "/from/" + connections.fromUserGuid + "/to/" + connections.toUserGuid;
				$.ajax({
					type : "DELETE",
					url : url,
					success : function(response){
						callback(response);
					},
					error : function(){
						console.log("Error deleting connection");
						Utils.ShowToast({message : "Error deleting connection"});
					}
				});
			},

			getConnections : function(userGUID, callback){
				var that = this;
				var guid = this.attributes.guid;
				var url = this.urlRoot() + "/" + userGUID + "/users";
				$.ajax({
					type : "GET",
					url : url,
					success : function(response){
						callback(response);
					},
					error : function(){
						console.log("Error fetching user connections");
					}
				});
			},

			getReceivedRequests : function(userGUID, callback){
				var that = this;
				var url = this.urlRoot() + "/receivedRequests/" + userGUID;
				$.ajax({
					type : "GET",
					url : url,
					success : function(response){
						callback(response);
					},
					error : function(){
						console.log("Error fetching received connections requests");
						Utils.ShowToast({message : "Error fetching received connections requests"});
					}
				});
			},

			getSentRequests : function(userGUID, callback){
				var that = this;
				var url = this.urlRoot() + "/sentRequests/" + userGUID;
				$.ajax({
					type : "GET",
					url : url,
					success : function(response){
						callback(response);
					},
					error : function(){
						console.log("Error fetching sent connections requests");
						Utils.ShowToast({message : "Error fetching sent connections requests"});
					}
				});
			},

			acceptConnection : function(connection, callback){
				var that = this;
				var url = this.urlRoot() + "/accept";
				$.ajax({
					type : "PUT",
					url : url,
					data : JSON.stringify(connection),
					contentType : "application/json",
					async : false,
					success : function(response){
						callback(response);
					},
					error : function(){
						console.log("Error accepting connections request");
					}
				});
			}

		});

		return Network;
	}
);