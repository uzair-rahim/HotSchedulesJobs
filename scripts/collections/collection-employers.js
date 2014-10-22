define([
		"backbone",
		"utils",
		"../models/model-employer"
	],
	function(Backbone, Utils, Employer){
		"use strict";

		var Employers = Backbone.Collection.extend({
			model : Employer,

			initialize : function(options){
				console.log("Employers collection initialized...");
			},

			urlRoot : function(){
				return Utils.GetURL("/services/rest/employer");
			},

			url : function(){
				var url = this.urlRoot();
				return url;
			},

			getEmployers : function(guids, callback){
				var that = this;
				var deferred = [];

				for(var i = 0; i < guids.length; i++){
					var url = this.urlRoot() + "/" + guids[i];
					deferred.push(
						$.ajax({
							url : url,
							success : function(response){
								that.models.push(response);
							}
						})
					);
				}

				$.when.apply($, deferred).done(function(){
					callback();
				});
			}
			
		});

		return Employers;

	}
);