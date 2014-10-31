define([
		"jquery",
        "app",
        "utils",
		"marionette",
		"scripts/views/view-head",
		"scripts/views/view-reset-password"
	],
	function($, App, Utils, Marionette, ViewHead, ViewResetPassword){
		"use strict";

		var AppController = Marionette.Controller.extend({

			reset : function(){

				Utils.ResetLayout();

				var head = new ViewHead();
				App.layout.head.show(head);

				var app = $(document).find(".app");

				if(!$(app).hasClass("background")){
					$(app).addClass("background");
				}

				var view = new ViewResetPassword();
				App.layout.body.show(view);
			}
		});

		return AppController;
	}
);