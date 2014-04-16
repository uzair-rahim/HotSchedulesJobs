require.config({
	paths: {
		app 			: "brushfire-app",
		utils			: "brushfire-utils",
		modernizr		: "libraries/thirdparty/modernizr.2.6.2",
		jquery			: "libraries/thirdparty/jquery.1.10",
		jqueryui		: "libraries/thirdparty/jquery.ui.1.10",
		jquerycookie	: "libraries/thirdparty/jquery.cookie",
		jquerydatatable	: "libraries/thirdparty/jquery.dataTables.min",
		vldt			: "libraries/thirdparty/vldt",
		underscore		: "libraries/thirdparty/underscore",
		backbone		: "libraries/thirdparty/backbone",
		wreqr			: "libraries/thirdparty/backbone.wreqr",
		marionette		: "libraries/thirdparty/backbone.marionette",
		Handlebars		: "libraries/thirdparty/handlebars",
		hbs 			: "libraries/thirdparty/hbs",
		i18nprecompile 	: "libraries/thirdparty/i18nprecompile",
		json2 			: "libraries/thirdparty/json2",
		approuter 		: "scripts/routers/brushfire-router",
		appcontroller 	: "scripts/controllers/brushfire-controller"
	},
	shim: {

		jquerycookie : {
			deps:["jquery"]
		},

		json2 : {
			deps:["jquery"]
		},
		
		backbone:{
			deps:["jquery", "underscore"],
			exports: "Backbone"
		},

		wreqr:{
			deps:["backbone"],
			exports: "Wreqr"
		},

		marionette:{
			deps:["backbone", "wreqr"],
			exports: "Marionette"
		},

		Handlebars:{
			deps:[],
			exports: "Handlebars"
		}
	},

	hbs:{
		templateExtension: "tpl",
		disableI18n: true,
		helperPathCallback: function(name){
			return "templates/helpers/" + name;
		}
	}
});

require(["app", "approuter"],function(App, ApplicationRouter){
	var options = {};
	var router = new ApplicationRouter();
	App.router = router;
	App.start(options);
});