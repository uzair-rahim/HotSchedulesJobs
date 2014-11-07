define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
		var Job = Backbone.Model.extend({

			initialize : function(){
				console.log("Job model initialized...");
			},

			urlRoot : function(){
				return Utils.GetURL("/services/rest/job");
			},
			
			url : function(){
				var url = this.urlRoot();
				return url;
			},

			getJobTypes : function(callback){
				var that = this;
				var url = Utils.GetURL("/services/rest/jobtypes");
				$.ajax({
					type : "GET",
					url : url,
					success : function(response){
						callback(response);
					},
					error : function(){
						console.log("Error fetching job types")
					}
				});
			},

			getEmployerJobs : function(employerGUID,callback){
				var that = this;
				var url = this.urlRoot() + "/list/"+employerGUID;
				$.ajax({
					type : "GET",
					url : url,
					success : function(response){
						callback(response);
					},
					error : function(){
						console.log("Error fetching jobs for employer");
					}
				});
			},

			updateCandidateHired : function(candidateGUID,candidate,callback){
				var that = this;
				var url = this.urlRoot() + "/candidate/" + candidateGUID + "/hired";
				$.ajax({
					type : "PUT",
					url : url,
					contentType : "application/json",
					data : JSON.stringify(candidate),
					success : function(response){
						callback(response);
					},
					error : function(){
						console.log("Error updating candidate status to hired");
					}
				});
			}

		});

		return Job;
	}
);