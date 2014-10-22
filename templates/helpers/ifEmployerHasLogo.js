define([
        "hbs/handlebars"
	], function (Handlebars) {
	
		function ifEmployerHasLogo(user, selected, options) {
			var employer = user.employers[selected];
			var logo = employer.logo;
			if(logo === null || typeof(logo) === "undefined") {
				return options.inverse(this);
			}else{
				return options.fn(this);
			}
		}
	
	Handlebars.registerHelper("ifEmployerHasLogo", ifEmployerHasLogo);
	return ifEmployerHasLogo;
});