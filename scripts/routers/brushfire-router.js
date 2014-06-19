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
				"forgotPassword"		: "forgotPassword",
				"signup"				: "signup",
				"findBusiness"			: "findBusiness",
				"addBusiness"			: "addBusiness",
				"accountVerification"	: "accountVerification",
				"jobs"					: "jobs",
				"candidates"			: "candidates",
				"candidates/job/:guid"	: "candidatesByJob",
				"profile/:id/:tab"		: "profile",
				"connections/:id"		: "connections",
				"network"				: "network",
				"messages"				: "messages",
				"accountSettings"		: "accountSettings",
				"profileSettings"		: "profileSettings",
				"logout"				: "logout",
				"support"				: "support"
			}

		});
		
		return AppRouter;
	}
);