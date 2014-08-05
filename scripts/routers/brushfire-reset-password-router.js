define([
		"marionette",
		"resetpasswordcontroller"
	],
	function(Marionette, AppController){
		"use strict";
	
		var AppRouter = Marionette.AppRouter.extend({
			controller : new AppController(),
			appRoutes : {
				""	: "reset"
			}

		});
		
		return AppRouter;
	}
);