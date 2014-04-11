define([
        'Handlebars'
], function ( Handlebars ) {
	
	function greaterThan(lvalue, rvalue, options) {
		if (lvalue > rvalue) {
			return options.fn(this);
		}
		else {
			return options.inverse(this);
		}
	}
	
	Handlebars.registerHelper( 'if_gt', greaterThan );
	return greaterThan;
});	