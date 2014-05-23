define([
	"Handlebars"
],
	function (Handlebars){
		function isNotNull(context, options){
			if(context != null){
				return options.fn(this);
			}else{
				return options.inverse(this);
			}
		}
	
	Handlebars.registerHelper("isNotNull", isNotNull);
	return isNotNull;
});	