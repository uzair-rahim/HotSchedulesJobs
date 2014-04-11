define([
        'Handlebars'
], 
	function (Handlebars){

		Handlebars.registerHelper("abs", function(value) {
			if(!isNaN(value))
				return Math.abs(value);
			else
				return value;
		});
});