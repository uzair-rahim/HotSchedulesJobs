define([
	'backbone',
	'utils',
	'scripts/models/model-employer-profile'
	],
	function(Backbone, Utils, EmployerProfile){
	'use strict';

	var EmployerProfiles = Backbone.Collection.extend({
		model : EmployerProfile,

		urlRoot : function(){
			return Utils.GetURL("/services/rest/employer");
		},
		
		url : function(){
			var url = this.urlRoot() + "/"+this.guid;
			return url;
		},

		initialize : function(options){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			this.guid = options.guid;
		}
		
	});

	return EmployerProfiles;

	}
);