define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
		var Referral = Backbone.Model.extend({

			initialize : function(){
				console.log('Referral Up model initialize...');
			},

			urlRoot : function(){
				return Utils.GetURL("/services/rest/referral");
			},

			url : function(){
				var url = this.urlRoot();
				return url;
			},

			getReferralsList : function(jobPostingGUID,userGUID,callback){
				var that = this;
				var guid = this.attributes.guid;
				var url = this.urlRoot() + "/?jobPostingGuid=" + jobPostingGUID + "&userGuid=" + userGUID;
				
				$.ajax({
					type 	: "GET",
					url		: url,
					success : function(response){
						callback(response);
					},
					error : function(model, errors){
						console.log("Error fetching referrals");
						Utils.ShowToast({message : "Error fetching referrals"});
					}
				})

			},

		});

		return Referral;
	}
);