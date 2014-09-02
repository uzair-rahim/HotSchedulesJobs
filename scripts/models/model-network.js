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
			}

		});

		return Network;
	}
);