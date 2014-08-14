define([
		"jquery",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-select-employer"
	],
	function($, App, Utils, Marionette, Template){
	"use strict";

	var SelectEmployer = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Select employer view initialized...");
		},

		onShow : function(){
			var employers = Utils.GetUserSession().adminEmployers;
			var alert = $(document).find("#app-alert-select-employer");

			$(alert).find(".custom-select button").text(employers[0].name);
			
			$.each(employers, function(){
				$(alert).find(".custom-select-list").append("<li>"+this.name+"</li>")
			});

			$(alert).addClass("show");
			Utils.ShowLoadingAnimation();
		},
	
		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return SelectEmployer;
});