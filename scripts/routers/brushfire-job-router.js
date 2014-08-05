define([
		"marionette",
		"jobcontroller"
	],
	function(Marionette, AppController){
		"use strict";
	
		var AppRouter = Marionette.AppRouter.extend({
			controller : new AppController(),
			appRoutes : {
				""	: "job"
			}

		});
		
		return AppRouter;
	}
);