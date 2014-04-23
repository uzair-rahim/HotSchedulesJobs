define([
		"jquery",
		"jquerycookie",
		"backbone"
	],
	function($, Cookie, Backbone){
		var BrushfireUtils = Backbone.Model.extend({

			// Check user session
			CheckSession : function(){
				console.log("Checking user session...");
				var BrushfireSession = $.cookie("BrushfireSession");
				return BrushfireSession !== undefined;
			},

			// Create user session
			CreateUserSession : function(options){
				console.log("Create user session...");
				var defaults = {
					firstname		: "",
					lastname		: "",
					guid			: "",
					employerIds		: "",
					brushfireToken	: ""
				}

				for(var key in defaults){
					if(typeof(options[key]) === "undefined"){
						options[key] = defaults[key];
					}
				}

				$.cookie("BrushfireSession", JSON.stringify(options));
			},

			// Delete user session
			DeleteUserSession : function(){
				console.log("Deleting user session...");
				$.removeCookie("BrushfireSession");
				$.removeCookie("BrushfireSession", { path : "/"});
			},

			// Get user session
			GetUserSession : function(){
				console.log("Getting user session...");

				var BrushfireSession = $.cookie("BrushfireSession");
				if(BrushfireSession !== undefined){
					return JSON.parse(BrushfireSession);
				}else{
					return false;
				}
			},

			// Custom select
			InitCustomSelect : function(){
				console.log("Custom Select Initialized...");

				$(document.body).delegate(".custom-select button", "click", function(event){
					var list = $(event.target).next();
					var isVisibile = $(list).hasClass("show");

					var customSelect = $(".custom-select-list");
					$(customSelect).removeClass("show");

					if(isVisibile){
						$(list).removeClass("show");
					}else{
						$(list).addClass("show");
					}
				});

				$(document.body).delegate(".custom-select ul li", "click", function(event){
					var button = $(event.target).parent().parent().find("button");
					var select = $(event.target).parent().parent();
					var list = $(event.target).parent();
					var item = $(event.target);
					var index = $(item).index();
					var value = $(item).text();
					
					$(select).attr("data-index", index);
					$(select).attr("data-value", value);
					$(list).removeClass("show");
					$(button).text(value);

				});

				$(document.body).on("click", function(event){
					var element = $(event.target);
					var isCustomSelect = $(element).hasClass("custom-select-button");
					var customSelect = $(".custom-select-list");

					if(!isCustomSelect){
						$(customSelect).removeClass("show");	
					}
					
				});
			},

			// Toast
			ShowToast : function(options){
				var defaults = {
					portal : false,
					type : "",
					message : "There was an error"
				}

				var className = "show";

				if(typeof options === "undefined"){
					options = defaults;
				}else{
					for(var key in defaults){
						if(typeof(options[key]) === "undefined"){
							options[key] = defaults[key];
						}
					}
				}
				
				if(options.portal){
					className = "show-on-portal";
				}

				$(document).find("#app-toast").addClass(options.type).addClass(className).text(options.message);

				var remove = setTimeout(function(){
					$(document).find("#app-toast").removeClass(className).removeClass(options.type);
				}, 4000);
			},

			// Show loading animation
			ShowLoadingAnimation : function(){
				$(document).find("#app-modal").addClass("show");
			},

			// Hide loading animation
			HideLoadingAnimation : function(){
				$(document).find("#app-modal").removeClass("show");
			}
			
		});

		var brushfireUtils = new BrushfireUtils();

		return brushfireUtils;
	}
);