define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-candidates",
		"scripts/models/model-candidate"
	],
	function($, Cookie, App, Utils, Marionette, Template, ModelCandidate){
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
			
			var item = $(event.target).closest("#candidates-list > li");
			var job = $(item).closest("#candidates-list");
			var isNewCandidate = $(item).find("*").hasClass("new");
			var allItems = $("#candidates-list > li");
			var profile = $(item).find(".hourly-profile");
			var isProfileExpanded = $(profile).hasClass("show");
			var allProfiles = $(".hourly-profile");

			$(allItems).removeClass("expanded");
			$(allItems).addClass("faded");
			$(allProfiles).removeClass("show");

			if(!isProfileExpanded){
				$(item).addClass("expanded");	
				$(item).removeClass("faded");	
				$(profile).addClass("show");

				if(isNewCandidate){
					$(item).find("*").removeClass("new");

					var request = new Object();
					var update = new Object();

					request.type = "update";
					request.jobGuid = $(job).attr("data-guid");
					request.guid = $(item).attr("data-guid");

					update.id = $(item).attr("data-id");;
					update.seen = true;

					var candidate = new ModelCandidate(request);

						candidate.save(update, {
							headers : {
								"token" : Utils.GetUserSession().brushfireToken
							},
							success : function(){
								console.log("Candidate successfully marked as seen...");
							},
							error : function(){
								console.log("There was an error trying to mark the cadndidates as seen");
								Utils.ShowToast({ message : "Unexpected error occured"});
							}
						});
				}


			}else{
				$(item).removeClass("expanded");
				$(allItems).removeClass("faded");	
				$(allProfiles).removeClass("show");
			}

			event.stopPropagation();
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