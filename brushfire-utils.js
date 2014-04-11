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

		});

		var brushfireUtils = new BrushfireUtils();

		return brushfireUtils;
	}
);