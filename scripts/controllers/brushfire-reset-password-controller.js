define([
		"jquery",
        "app",
        "utils",
		"marionette",
		"scripts/layouts/layout-app",
		"scripts/views/view-head",
		"scripts/views/view-reset-password"
	],
	function($, App, Utils, Marionette, LayoutApp, ViewHead, ViewResetPassword){
		"use strict";

		var AppController = Marionette.Controller.extend({

			reset : function(){

				Utils.ResetLayout();

				var layout = new LayoutApp();
				App.body.show(layout);

				var head = new ViewHead();
				layout.head.show(head);

				var app = $(document).find(".app");

				if(!$(app).hasClass("background")){
					$(app).addClass("background");
				}

				var view = new ViewResetPassword();
				layout.body.show(view);
			}
		});

		return AppController;
	}
);