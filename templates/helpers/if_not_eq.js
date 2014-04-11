define([
        'Handlebars'
], function ( Handlebars ) {
	
	function notEqualTo(lvalue, rvalue, options) {
		if (lvalue !== rvalue) {
			return options.fn(this);
		}
		else {
			return options.inverse(this);
		}
	}
	
	Handlebars.registerHelper( 'if_not_eq', notEqualTo );
	return notEqualTo;
});