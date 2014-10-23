define([
        "hbs/handlebars"
	], function (Handlebars) {
	
		function getEmployerName(user, selected) {
			if(user.employers.length > 0){
				var employer = user.employers[selected];
				return employer.name;
			}else{
				return "";
			}
		}
	
	Handlebars.registerHelper("getEmployerName", getEmployerName);
	return getEmployerName;
});