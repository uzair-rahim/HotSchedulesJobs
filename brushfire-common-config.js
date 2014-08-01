require.config({
    baseUrl: ".",
    paths: {
		app 			: "brushfire-app",
		utils			: "brushfire-utils",
		modernizr		: "libraries/thirdparty/modernizr.2.6.2",
		jquery			: "libraries/thirdparty/jquery.1.10",
		jqueryui		: "libraries/thirdparty/jquery.ui.1.10",
		jquerycookie	: "libraries/thirdparty/jquery.cookie",
		jquerydatatable	: "libraries/thirdparty/jquery.dataTables.min",
		vldt			: "libraries/thirdparty/vldt",
		backbone		: "libraries/thirdparty/backbone",
		wreqr			: "libraries/thirdparty/backbone.wreqr",
		marionette		: "libraries/thirdparty/backbone.marionette",
		hbs 			: "libraries/thirdparty/hbs",
        Handlebars		: "libraries/thirdparty/hbs/handlebars",
		i18nprecompile 	: "libraries/thirdparty/hbs/i18nprecompile",
		json2 			: "libraries/thirdparty/hbs/json2",
		underscore		: "libraries/thirdparty/hbs/underscore",
		// brushfire-config
        approuter 		: "scripts/routers/brushfire-router",
   		appcontroller 	: "scripts/controllers/brushfire-controller",
   		// brushfire-job-config
        async			: "libraries/thirdparty/async",
	    jobrouter 		: "scripts/routers/brushfire-job-router",
	    jobcontroller 	: "scripts/controllers/brushfire-job-controller",
	    // brushfire-reset-password-config
        resetpasswordrouter     : "scripts/routers/brushfire-reset-password-router",
	    resetpasswordcontroller : "scripts/controllers/brushfire-reset-password-controller"
	},
	shim: {

		jqueryui : {
			deps:["jquery"]
		},

		jquerycookie : {
			deps:["jquery"]
		},

		json2 : {
			deps:["jquery"]
		},
		
		backbone:{
			deps:["jquery", "hbs/underscore"],
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

