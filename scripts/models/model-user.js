define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
		var User = Backbone.Model.extend({

			defaults : {
				id 					: null,
				firstname 			: null,
				lastname 			: null,
				email 				: null,
				guid 				: null,
				about 				: null,
				verified 			: null,
				followedEmployerIds : null,
				endorsedEmployerIds : null,
				identities 			: null,
				emails 				: null,
				password 			: null,
				placesWorkedCount 	: null,
				returning 			: null,
				employerIds 		: null,
				adminEmployers 		: null,
				photo 				: null,
				primaryWorkHistory 	: null,
				workHistory 		: null,
				roles 				: null,
				location 			: null,
				accountState 		: null,
			},

			initialize : function(){
				console.log("User model initialize...");
			},

			url : function(){
				var url = this.urlRoot();
				return url;
			},

			urlRoot : function(){
				return Utils.GetURL("/services/rest/user");
			},

			getWorkHistory : function(callback){
				var that = this;
				var guid = this.attributes.guid;
				var url = this.urlRoot() + "/" + guid + "/workHistory";
				
				$.ajax({
					type 	: "GET",
					url		: url,
					success : function(response){
						that.set({workHistory : response.history});
						callback();
					},
					error : function(model, errors){
						console.log("Error fetching user work history");
						Utils.ShowToast({message : "Error fetching user work histroy"});
					}
				})

			},

			getNetworkUsers : function(callback){
				var that = this;
				var guid = this.attributes.guid;
				var url = this.urlRoot() + "/" + guid + "/network/users";
				$.ajax({
					type : "GET",
					url : url,
					success : function(response){
						callback(response);
					},
					error : function(){
						console.log("Error fetching user work history");
						Utils.ShowToast({message : "Error fetching user network"});
					}
				});
			}

		});

		return User;
	}
);