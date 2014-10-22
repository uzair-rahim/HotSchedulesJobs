define([
        "hbs/handlebars"
	], function (Handlebars) {
	
		function getEmployerName(user, selected) {
			var employer = user.employers[selected];
			return employer.name;
		}
	
	Handlebars.registerHelper("getEmployerName", getEmployerName);
	return getEmployerName;
});