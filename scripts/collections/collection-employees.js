define([
	"app",
	"backbone",
	"utils",
	"scripts/models/model-business"
	],
	function(App, Backbone, Utils, ModelBusiness){
	'use strict';

	var Employees = Backbone.Collection.extend({
		model : ModelBusiness,

		urlRoot : function(){
			return Utils.GetURL("/services/rest/employer");
		},
		
		url : function(){
			var url = this.urlRoot() + "/"+App.session.getEmployerGUID()+"/employees";
			return url;
		},

		initialize : function(options){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
		}
		
	});

	return Employees;

	}
);