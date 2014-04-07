define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-find-business"
	],
	function($, Cookie, App, Utils, Marionette, Template){
	"use strict";

	var ViewFindBusiness = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #find"	: "find",
			"click #cancel"	: "cancel"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Find Business view initialized...");
		},

		find : function(){
			console.log("Find...");
			App.router.navigate("addBusiness", true);
		},

		cancel : function(){
			console.log("Cancel...");
			App.router.navigate("signup", true);
		},
		
		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewFindBusiness;
});