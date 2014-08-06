define([
	"backbone",
	"utils",
	"scripts/models/model-support-search"
	],
	function(Backbone, Utils, ModelSupportSearch){
	'use strict';
	
		var SupportSearch = Backbone.Collection.extend({
			model : ModelSupportSearch,
			urlRoot : function(){
				return Utils.GetURL("/services/rest/search/admin?searchString=");
			},
			
			url : function(){
				var url = this.urlRoot() + this.string;
				return url;
			},

			initialize : function(options){
				console.log("Support Search collection initialized...");
				this.string = options.string;
			}

		});

		return SupportSearch;
	}
);