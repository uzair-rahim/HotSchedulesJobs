define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-support",
		"scripts/collections/collection-support-search"
	],
	function($, Cookie, App, Utils, Marionette, Template, CollectionSupportSearch){
	"use strict";

	var ViewSupport = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #search-button"	: "search",
			"click #clear-search"	: "clearSearch"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Support view initialized...");
		},

		search : function(){
			var that = this;
			var searchTerm = $("#search-field").val();
			if(searchTerm !== ""){
				var search = new CollectionSupportSearch({string : searchTerm});

					search.fetch({
						success : function(response){
							that.model = response.models;
							that.render();
						},
						error : function(){
							console.log("Error fetching search results...");
							Utils.ShowToast({ message : "Error fetching search results..."});
						}
					});

			}
		},
		
		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.results = this.model;
				jsonObject.language = App.Language;
				console.log(jsonObject);
			return jsonObject;
		}
		
	});

	return ViewSupport;
});