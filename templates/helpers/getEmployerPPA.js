define([
	"Handlebars"
],
	function (Handlebars){
		function getEmployerPPA(types, index){

			return types[index].label;

		}
	
	Handlebars.registerHelper("getEmployerPPA", getEmployerPPA);
	return getEmployerPPA;
});	