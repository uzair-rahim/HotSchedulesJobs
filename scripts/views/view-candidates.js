define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-candidates"
	],
	function($, Cookie, App, Utils, Marionette, Template){
	"use strict";

	var ViewCandidates = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #breadcrumb li" 		: "back",
			"click #send-message"		: "sendMessage",
			"click .view-profile"		: "profile",
			"click .candidate-select"	: "candidateSelect",
			"click .candidate-message"	: "candidateMessage",
			"click .candidate-archive"	: "candidateArchive"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Candidates view initialized...");
		},

		back : function(event){
			var index = $(event.target).index();
			var goBack = (index+1) - App.getTrailLength();

			if(goBack !== 0){
				window.history.go(goBack);
			}
		},

		sendMessage : function(){
			alert("Send a Message");
		},

		profile : function(event){
			event.stopPropagation();
			//App.router.navigate("profile/jobs/jobs", true);
		},

		candidateSelect : function(event){
			var count = $(".candidate-select:checked").length;
			if(count > 0){
				$("#archive-candidates").css("display", "block");
			}else{
				$("#archive-candidates").css("display", "none");
			}
			event.stopPropagation();
		},

		candidateMessage : function(event){
			alert("Send Message");
			event.stopPropagation();
		},

		candidateArchive : function(event){
			alert("Archive Candidate");
			event.stopPropagation();
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
				jsonObject.jobtypes = this.model.jobtypes;
				jsonObject.jobs = this.model.jobs;
				jsonObject.breadcrumb = App.getTrail();
			return jsonObject;
		}
		
	});

	return ViewCandidates;
});