define([
        "hbs/handlebars"
	], function (Handlebars) {
	
		function ifTrue(lvalue, options) {
			if (lvalue === true) {
				return options.fn(this);
			}else {
				return options.inverse(this);
			}
		}
	
	Handlebars.registerHelper("if_true", ifTrue);
	return ifTrue;
});