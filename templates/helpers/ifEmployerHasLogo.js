define([
        "hbs/handlebars"
	], function (Handlebars) {
	
		function ifEmployerHasLogo(user, selected, options) {
		    if (user.employers === null || typeof(user.employers) === "undefined") {
		        return options.inverse(this);
		    }
			var employer = user.employers[selected];
			if(employer === null || typeof(employer) === "undefined"){
				return options.inverse(this);
			}else{
				if(employer.logo === null || typeof(employer.logo) === "undefined") {
					return options.inverse(this);
				}else{
					return options.fn(this);
				}
			}
		}
	
	Handlebars.registerHelper("ifEmployerHasLogo", ifEmployerHasLogo);
	return ifEmployerHasLogo;
});