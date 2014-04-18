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
						option[key] = defaults[key];
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
			}

		});

		var brushfireUtils = new BrushfireUtils();

		return brushfireUtils;
	}
);