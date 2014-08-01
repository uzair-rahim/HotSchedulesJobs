define([
	"hbs/handlebars"
	],
	function (Handlebars){
		function hasPrimaryWorkHistory(context, options){
			if(context != null){
				return options.fn(this);
			}else{
				return options.inverse(this);
			}
		}
	
	Handlebars.registerHelper('hasPrimaryWorkHistory', hasPrimaryWorkHistory);
	return hasPrimaryWorkHistory;
});	