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

                var qs = window.location.href.split('?')[1];
                var args = Utils.GetQueryParameters(qs);
				var jobGUID = args.id;
				var appliedFor = args.appliedFor;

				if(!jobGUID){
					window.location.href = "index.jsp";
				}else{

					var restURL = Utils.GetURL("/services/rest/public/jobposting/");

					$.ajax({
						url : restURL + jobGUID + "/data",
						type : "GET",
						success : function(response){
						    response.appliedFor = appliedFor;
						    var view = new ViewJob({model : response});
							layout.body.show(view);
						},
						error : function(){
							var data = new Object();
								data.status = "UNPOSTED";
							var view = new ViewJob({model : data});
							layout.body.show(view);
						}
					});
				}
				
			}
		});

		return AppController;
	}
);