define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-connections",
		"scripts/models/model-user"
	],
	function($, Cookie, App, Utils, Marionette, Template, ModelUser){
	"use strict";

	var ViewConnections = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click .candidate-select"	: "connectionSelect",
			"click .candidate-message"	: "connectionMessage",
			"click #send-message"		: "sendBulkMessage",
			"click #breadcrumb li" 		: "back",
			"click .view-profile"		: "profile",
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Connections view initialized...");
		},

		onShow : function(){
			$("#filter").hide();
		},

		back : function(event){
			var index = $(event.target).index();
			var goBack = (index+1) - App.getTrailLength();

			if(goBack !== 0){
				window.history.go(goBack);
			}
		},

		connectionSelect : function(event){
			var count = $(".candidate-select:checked").length;
			if(count > 0){
				$("#send-message").prop("disabled",false);
			}else{
				$("#send-message").prop("disabled",true);
			}
			event.stopPropagation();
		},

		connectionMessage : function(event){
			var email = $(event.target).closest("li.view-profile").data("email");
			window.location.href = "mailto:"+email;
			event.stopPropagation();
		},

		sendBulkMessage : function(event){
			var manager = Utils.GetUserSession().email;
			var addresses = [];

			$(".candidate-select:checked").each(function(){
				var email = $(this).closest("li.view-profile").data("email");
				addresses.push(email);
			});

			var emails = addresses.join(",");
			window.location.href = "mailto:"+manager+"?bcc="+emails;
			$(".candidate-select").prop("checked", false);
		},

		profile : function(event){

			var item = $(event.target).closest("#connections-list > li");
			var userGuid = $(item).attr("data-guid");
			var profile = $(item).find(".hourly-profile");
			var isProfileExpanded = $(profile).hasClass("show");
			var allProfiles = $(".hourly-profile");
			var allItems = $("#connections-list > li");

			$(allItems).removeClass("expanded");
			$(allItems).addClass("faded");
			$(allProfiles).removeClass("show");

			if(!isProfileExpanded){

				var user = new ModelUser();
				user.set({guid : userGuid});
				user.getWorkHistory(function(){
					var history = user.get("workHistory");
					var list = $(item).find(".hourly-profile .history-section .work-history");
					$(list).html("");
					
					if(history.length > 0){
						$.each(history, function(){
							var el = "<li>";
									el += "<div class='employer-logo'>"
										if(this.employer.logo !== null){
											el += "<img src='"+this.employer.logo.url+"'/>";
										}
									el += "</div>"	
									el += "<div class='employment-info'>"
										el += "<div class='employer-name'>"
											var total = this.jobs.length;
											$.each(this.jobs, function(index){
												el += this.jobName;
												if(index !== total-1){
													el += ", ";
												}
											});
										el += "</div>"
										el += "<div class='employment-position'>@"+ this.employer.name +"</div>"
										el += "<div class='employment-date'>"+ Utils.FormatDate(this.startDateMillis, "month/yyyy") + " - " + Utils.FormatDate(this.endDateMillis, "month/yyyy") +"</div>"
									el += "</div>"
								el += "</li>"
							$(list).append(el);
						});
					}else{
						$(list).remove();
						$(item).find(".hourly-profile .history-section").append("<div class='history'>Not Available</div>");
					}

					$(item).addClass("expanded");	
					$(item).removeClass("faded");	
					$(profile).addClass("show");
				});

			}else{
				$(item).removeClass("expanded");
				$(allItems).removeClass("faded");	
				$(allProfiles).removeClass("show");
			}

			event.stopPropagation();
		},
		
		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.connections = this.model;
				jsonObject.language = App.Language;
				jsonObject.breadcrumb = App.getTrail();
				jsonObject.name = Utils.GetSharedConnectionName();
			return jsonObject;
		}
		
	});

	return ViewConnections;
});