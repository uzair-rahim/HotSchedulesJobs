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
			"click #search-button"	: "search"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Support view initialized...");
		},

		onShow : function(){
			$("#search-field").keyup(function(event){
				if(event.keyCode == 13){
					$("#search-button").click();
				}
			});
		},

		search : function(){
			var that = this;
			var searchTerm = $("#search-field").val();
			if(searchTerm !== ""){
				var search = new CollectionSupportSearch({string : searchTerm});

					search.fetch({
						success : function(response){
							var employers = new Array();

							for(var i = 0; i < response.length; i++){
								var model = response.models[i].toJSON();
								var admin = model["admin"];
								var user = model["user"];
								var employer = model["employer"];
								var employerGuid = employer.guid;
								var exists = $.inArray(employerGuid, employers);
								if(exists === -1){
									employers.push(employerGuid);
								}
							}
							
							console.log(employers);

							//that.model = response.models;
							//that.render();
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