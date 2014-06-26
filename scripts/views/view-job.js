define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-job"
	],
	function($, Cookie, App, Utils, Marionette, Template){
	"use strict";

	var ViewJob = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		googlePlayURL : "https://play.google.com/store/apps/details?id=com.tdr3.hs.android",
		appStoreURL : "https://itunes.apple.com/us/app/hotschedules/id294934058?mt=8",
		events : {
			"click #google-play"	: "androidDevice",
			"click #app-store"		: "iOSDevice"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Job view initialized...");
		},

		onShow : function(){
			var device = this.detectDevice();
			switch(device){
				case "iOS" :
					$("#google-play").remove();
					$("#job-apps").addClass("mobile");
				break;

				case "Android":
					$("#app-store").remove()
					$("#job-apps").addClass("mobile");
				break;
			}
		},

		detectDevice : function(){
			var agent = navigator.userAgent;

			if(agent.match(/Android/i)){
				return "Android";
			}else if(agent.match(/iPhone|iPad|iPod/i)){
				return "iOS";
			}else if(agent.match(/IEMobile/i)){
				return "WindowsMobile";
			}else{
				return "Unknown";
			}

		},

		androidDevice : function(){
			var device = this.detectDevice();
			if(device === "Android"){

			}else{
				window.location = this.googlePlayURL;
			}
		},

		iOSDevice : function(){
			var device = this.detectDevice();
			var that = this;
			if(device === "iOS"){
				setTimeout(function () {
	    	    	window.location = that.appStoreURL;
	    		}, 20);
	    		
	    		var jobPostingGUID = Utils.GetStandaloneJobGUID();
	    		var jobPostingEmployerGUID = this.model.employer.guid;

	    		var appURL = "hotschedulespost://?jobpostingguid="+jobPostingGUID+"&jobpostingempguid="+jobPostingEmployerGUID;
	    		
	    		window.location = appURL;

			}else{
				window.location = this.appStoreURL;
			}
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.job = this.model;
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewJob;
});