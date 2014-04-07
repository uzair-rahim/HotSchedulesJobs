define([
		"marionette",
		"appcontroller"
	],
	function(Marionette, AppController){
		"use strict";
	
		var AppRouter = Marionette.AppRouter.extend({
			controller : new AppController(),
			appRoutes : {
				""						: "session",
				"login"					: "login",
				"signup"				: "signup",
				"findBusiness"			: "findBusiness",
				"addBusiness"			: "addBusiness",
				"accountVerification"	: "accountVerification",
				"jobs"					: "jobs",
				"candidates"			: "candidates",
				"candidates/job"		: "candidatesByJob",
				"profile/:id/:tab"		: "profile",
				"network"				: "network",
				"messages"				: "messages",
				"settings"				: "settings",
				"logout"				: "logout"
			}

		});
		
		return AppRouter;
	}
);