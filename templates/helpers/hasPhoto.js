define([
	'Handlebars'
],
	function (Handlebars){
		function hasPhoto(context, options){
			if(context != null){
				return options.fn(this);
			}else{
				return options.inverse(this);
			}
		}
	
	Handlebars.registerHelper('hasPhoto', hasPhoto);
	return hasPhoto;
});	