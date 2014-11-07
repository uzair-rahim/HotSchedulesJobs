define([
		"jquery",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-job-form",
	],
	function($, App, Utils, Marionette, Template){
	"use strict";

	var JobForm = Marionette.ItemView.extend({
		tagName : "div",
		className : "job-information show",
		template: Template,
		events : {
			"click .cancel"	: "cancel"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Job From view initialized...");
		},

		cancel : function(event){
			$(this.el).parent().removeClass("expanded");
			this.remove();
			event.stopPropagation();
		},
		
		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.job = this.model.job;
				jsonObject.types = this.model.types;
			return jsonObject;
		}
		
	});

	return JobForm;
});