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
				"network"				: "network",
				"messages"				: "messages",
				"accountSettings"		: "accountSettings",
				"profileSettings"		: "profileSettings",
				"logout"				: "logout",
				"support"				: "support",
				"selectEmployer"		: "selectEmployer",
				"sso?*qp"				: "sso"
			}

		});
		
		return AppRouter;
	}
);