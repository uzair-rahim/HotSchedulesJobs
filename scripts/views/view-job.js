define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-job",
		"async!https://maps.googleapis.com/maps/api/js?key=AIzaSyA6cyoae_8rRsygZxbPIiuNp220ipankW0&sensor=false"
	],
	function($, Cookie, App, Utils, Marionette, Template, Async){
	"use strict";

	var ViewJob = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click .google-hspost-scheme"	: "openGooglePlay",
			"click .ios-hspost-scheme"		: "openAppStore"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Job view initialized...");
		},

		onShow : function(){

			if(this.model.status == "POSTED"){
				var mapLatLng = new google.maps.LatLng(this.model.employer.location.latitude,this.model.employer.location.longitude)

				var mapOptions = {
					disableDefaultUI: true,
					center: mapLatLng,
					zoom: 14
				}

				var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

				var marker = new google.maps.Marker({
					map: map,
					position: mapLatLng,
				});
			}


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

		openGooglePlay : function(){
			var device = this.detectDevice();
			if(device === "Android"){
				var jobPostingGUID = Utils.GetStandaloneJobGUID();
	    		var jobPostingEmployerGUID = this.model.employer.guid;
	    		var url = "intent://?jobpostingguid="+jobPostingGUID+"&jobpostingempguid="+jobPostingEmployerGUID+"#Intent;package=com.hotschedules.brushfire;scheme=hotschedulespost;end";
	    		window.location = url
			}else{
				window.location = Utils.GetStoreLinks().google;
			}
		},

		openAppStore : function(){
			var device = this.detectDevice();
			if(device === "iOS"){
				setTimeout(function () {
	    	    	window.location = Utils.GetStoreLinks().apple;
	    		}, 20);
	    		
	    		var jobPostingGUID = Utils.GetStandaloneJobGUID();
	    		var jobPostingEmployerGUID = this.model.employer.guid;
	    		var url = "hotschedulespost://?jobpostingguid="+jobPostingGUID+"&jobpostingempguid="+jobPostingEmployerGUID;

	    		window.location = url
			}else{
				window.location = Utils.GetStoreLinks().apple;
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