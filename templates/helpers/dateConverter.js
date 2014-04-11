define([
	"Handlebars"
],
	function (Handlebars){
		function dateConverter(context){

			var date = new Date(context);
			var	retval = (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
			
			return retval;
		}
	
	Handlebars.registerHelper('dateConverter', dateConverter);
	return dateConverter;
});	