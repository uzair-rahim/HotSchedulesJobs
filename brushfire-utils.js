define([
		"jquery",
		"jquerycookie",
		"backbone"
	],
	function($, Cookie, Backbone){
		var BrushfireUtils = Backbone.Model.extend({

			CONTEXT : CONTEXT_ROOT,

			// Get URL
			GetURL : function(url){
				//return this.CONTEXT + url;
				return "../services" + url;
			},

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
					email			: "",
					verified		: false,
					employerIds		: "",
					role			: "user"
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
					portal : true,
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

			ShowAlert : function(options){
				defaults = {
					listener : "",
					primary : false,
					primaryType : "",
					secondaryType : "",
					primaryText : "OK",
					secondaryText : "Cancel",
					title : "Warning",
					message : "Are you sure?"
				}

				if(typeof options === "undefined"){
					options = defaults;
				}else{
					for(var key in defaults){
						if(typeof(options[key]) === "undefined"){
							options[key] = defaults[key];
						}
					}
				}

				var alert = $(document).find("#app-alert");

				$(alert).addClass("show");
				$(alert).attr("data-listener", options.listener);
				$(alert).find(".alert-title").text(options.title);
				$(alert).find(".alert-message").text(options.message);

				if(!options.primary){
					$(alert).find(".alert-action #primary-action").hide();
					$(alert).find(".alert-action").addClass("single");
				}else{
					$(alert).find(".alert-action #primary-action").show();
					$(alert).find(".alert-action #primary-action").text(options.primaryText).addClass(options.primaryType);
				}

				$(alert).find(".alert-action #secondary-action").text(options.secondaryText).addClass(options.secondaryType);

				$(document).find("#app-modal").addClass("show");
			},

			HideAlert : function(){
				$(document).find("#app-alert").removeClass("show");
				$(document).find("#app-alert .alert-action").removeClass("single");
				$(document).find("#app-modal").removeClass("show");
			},

			// Show loading animation
			ShowLoadingAnimation : function(){
				$(document).find("#app-modal").addClass("show");
			},

			// Hide loading animation
			HideLoadingAnimation : function(){
				$(document).find("#app-modal").removeClass("show");
			},

			InitMaxTextAreaLength : function(){
				var maxlength = 512;
				$(document.body).delegate("textarea", "keyup", function(){
					if ($(this).val().length > maxlength) {  
            			$(this).val($(this).val().substring(0, maxlength));  
        			} 
				});
			},

			// Reset Layout
			ResetLayout : function(){
				$(document).find("#app-modal").remove();
				$(document).find("#app-toast").remove();
				$(document).find("#app-alert").remove();

				$(document).find("#app-head").html("");
				$(document).find("#app-body .content").html("");

			},

			// Get Standalone Job GUID
			GetStandaloneJobGUID : function(){
				console.log("Getting Standalone Job GUID...");

				var url = window.location.href;
				var indexOfID = url.indexOf("?id=");
				var id = url.substring(indexOfID+4); 

				var StandaloneJobGUID = id;
				
				if(StandaloneJobGUID !== undefined){
					return StandaloneJobGUID;
				}else{
					return false;
				}
			},

			// Show Help Content
			ShowHelp : function(){
				var help = $("#app-help");
				var isVisible = $(help).hasClass("show")
				if(isVisible){
					$(help).removeClass("show");
				}else{
					$(help).addClass("show");
				}
			},

			// Hide Help Content
			HideHelp : function(){
				var help = $("#app-help");
				$(help).removeClass("show");
			},

			// Show Terms and Conditions
			ShowTermsAndConditions : function(options){

				var defaults = {
					inApp				: false,
					secondaryButtonText : "Decline" 
				}

				for(var key in defaults){
					if(typeof(options[key]) === "undefined"){
						options[key] = defaults[key];
					}
				}

				var alert = $("#alert-terms-conditions");
				$(alert).addClass("show");

				if(options.inApp){
					$("#accept-terms").hide();
					$("#decline-terms").text(options.secondaryButtonText);
					$(document).find("#alert-terms-conditions .alert-action").addClass("single");
				}

				$(document).find("#app-modal").addClass("show");
			},

			// Show Terms and Conditions
			HideTermsAndConditions : function(){
				var alert = $("#alert-terms-conditions");
				$(alert).removeClass("show");
				$("#accept-terms").show();
				$("#decline-terms").text("Decline");
				$(document).find("#alert-terms-conditions .alert-action").removeClass("single");
				$(document).find("#app-modal").removeClass("show");
			},

			// Links to Google Play and App Store
			GetStoreLinks : function(){
				var links = new Object();
					links.google = "http://play.google.com/store/apps/details?id=com.hotschedules.brushfire"
					links.apple = "https://itunes.apple.com/us/app/hotschedules/id888794188?mt=8"

				return links;
			}
			
		});

		var brushfireUtils = new BrushfireUtils();

		return brushfireUtils;
	}
);