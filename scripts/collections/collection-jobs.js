define([
	"backbone",
	"utils",
	"scripts/models/model-job"
	],
	function(Backbone, Utils, Job){
	"use strict";

	var Jobs = Backbone.Collection.extend({
		model : Job,

		urlRoot : function(){
			return Utils.GetURL("/services/rest/job/");
		},
		
		url : function(){
			var user= Utils.GetUserSession();
			var url = this.urlRoot();
			var index = Utils.GetSelectedEmployer();
			
			if(typeof this.guid !== "undefined"){
				url += this.guid;
			}else{
				url += "list/" + user.employerIds[index];
			}

			return url;
		},

		initialize : function(options){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Jobs collection initialized....");
			
			if(typeof options !== "undefined"){
				this.guid = options.guid;	
			}
		}

	});

	return Jobs;

	}
);