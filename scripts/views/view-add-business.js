define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-add-business"
	],
	function($, Cookie, App, Utils, Marionette, Template){
	"use strict";

	var ViewAddBusiness = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #add"	: "add",
			"click #cancel"	: "cancel"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Add Business view initialized...");
		},

		add : function(){
			console.log("Add...");
			App.router.navigate("accountVerification", true);
		},

		cancel : function(){
			console.log("Cancel...");
			App.router.navigate("findBusiness", true);
		},
		
		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewAddBusiness;
});