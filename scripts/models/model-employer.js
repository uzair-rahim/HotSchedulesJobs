define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
		var Employer = Backbone.Model.extend({

			defaults : {
				id 		: null,
				guid 	: null
			},

			initialize : function(){
				console.log("Employer model initialize...");
			},

			url : function(){
				var url = this.urlRoot();
				return url;
			},

			urlRoot : function(){
				return Utils.GetURL("/services/rest/employer");
			},

			getInterestedUsersCount : function(employerGUID,callback){
				var that = this;
				var url = this.urlRoot() + "/" + employerGUID + "/interestedUsersWithJobTypes/count";
				$.ajax({
					type : "GET",
					url : url,
					success : function(response){
						callback(response);
					},
					error : function(){
						console.log("Error fetching interested users count");
					}
				});
			},

			getCandidatesByEmployerGUID : function(employerGUID,start,rows,archived,callback){
				var that = this;
				var url = this.urlRoot() + "/" + employerGUID + "/candidates?start=" + start + "&rows=" + rows + "&archived=" + archived;
				$.ajax({
					type : "GET",
					url : url,
					success : function(response){
						callback(response);
					},
					error : function(){
						console.log("Error fetching candidates");
					}
				});
			}

		});

		return Employer;
	}
);