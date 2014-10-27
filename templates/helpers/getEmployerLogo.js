define([
        "hbs/handlebars"
	], function (Handlebars) {
	
		function getEmployerLogo(user, selected) {
			var employer = user.employers[selected];
			var logo = employer.logo;
			return logo.url;
		}
	
	Handlebars.registerHelper("getEmployerLogo", getEmployerLogo);
	return getEmployerLogo;
});