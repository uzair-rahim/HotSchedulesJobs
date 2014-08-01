define([
	'hbs/handlebars'
],
	function (Handlebars){
		function log(context){
			return console.log(context);
		}
	
	Handlebars.registerHelper('log', log);
	return log;
});	