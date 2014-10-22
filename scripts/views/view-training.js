define([
		"jquery",
		"jquerycookie",
		"analytics",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-training",
		"scripts/models/model-user"
	],
	function($, Cookie, Analytics, App, Utils, Marionette, Template, ModelUser){
	"use strict";

	var ViewTraining = Marionette.ItemView.extend({
		tagName : "div",
		className : "",
		template: Template,
		events : {
			"click .close-training"	: "closeTraining",
			"click #continue-job"	: "showShareTraining",
			"click #continue-word"	: "showTalentTraining",
			"click #back-word"		: "showJobTraining",
			"click #back-talent"	: "showShareTraining",
			"click #finish-talent"	: "closeTraining"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Training view initialized...");
		},

		onRender : function(){
			ga('create', 'UA-52257201-1', 'hotschedulespost.com');
      		ga('send', 'pageview', '/training');

      		var training = localStorage.getItem("training");

      		if(training == "null"){
      			var trainingEventGUID = localStorage.getItem("trainingEventGUID");
      			var date = new Date();
      			var data = {
      				"guid" : trainingEventGUID,
      				"completed" : date.getTime()
      			}

      			var user = new ModelUser();
      				user.updateUserEvent(App.session.get("guid"), data.guid, data, function(response){
      					localStorage.setItem("training", date.getTime());	
      				});
      		}
		},

		closeTraining : function(){
			this.remove();
		},

		showJobTraining : function(){
			$(".app-alert.training").removeClass("show");
			$("#app-alert-training-job").addClass("show");
		},

		showShareTraining : function(){
			$(".app-alert.training").removeClass("show");
			$("#app-alert-training-spread").addClass("show");
		},

		showTalentTraining : function(){
			$(".app-alert.training").removeClass("show");
			$("#app-alert-training-talent").addClass("show");
		},

		serializeData : function(){
			var jsonObject = new Object();
			return jsonObject;
		}
		
	});

	return ViewTraining;
});