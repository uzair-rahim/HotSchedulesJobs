define([
		"jquery",
        "app",
        "utils",
		"marionette",
		"scripts/layouts/layout-app",
		"scripts/views/view-job"
	],
	function($, App, Utils, Marionette, LayoutApp, ViewJob){
		"use strict";

		var AppController = Marionette.Controller.extend({


			job : function(){

				var layout = new LayoutApp();
				App.body.show(layout);

				var app = $(document).find(".app");
				$(app).addClass("background");

				Utils.ResetLayout();

				var jobGUID = Utils.GetStandaloneJobGUID();

				if(!jobGUID){
					window.location.href = "index.jsp";
				}else{

					var restURL = Utils.GetURL("/services/rest/public/jobposting/");

					$.ajax({
						url : restURL + jobGUID + "/data",
						type : "GET",
						success : function(response){
							var view = new ViewJob({model : response});
							layout.body.show(view);
						},
						error : function(){
							console.log("Error fetching job...");
							window.location.href = "index.jsp";
						}
					});
				}
				
			}
		});

		return AppController;
	}
);