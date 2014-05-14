define([
	"backbone",
	"utils",
	"scripts/models/model-business"
	],
	function(Backbone, Utils, ModelBusiness){
	'use strict';

	var Employees = Backbone.Collection.extend({
		model : ModelBusiness,

		urlRoot : function(){
			return Utils.GetURL("/services/rest/employer");
		},
		
		url : function(){
			var url = this.urlRoot() + "/"+this.guid+"/employees";
			return url;
		},

		initialize : function(options){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			this.guid = options.guid;
		}
		
	});

	return Employees;

	}
);