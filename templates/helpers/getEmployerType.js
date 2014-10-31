define([
	"hbs/handlebars"
],
	function (Handlebars){
		function getEmployerType(types, index){

			return types[index].label;

		}
	
	Handlebars.registerHelper("getEmployerType", getEmployerType);
	return getEmployerType;
});	