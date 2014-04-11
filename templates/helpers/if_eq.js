define([
        'Handlebars'
], function ( Handlebars ) {
	
	function equalTo(lvalue, rvalue, options) {
		if (lvalue === rvalue) {
			return options.fn(this);
		}
		else {
			return options.inverse(this);
		}
	}
	
	Handlebars.registerHelper( 'if_eq', equalTo );
	return equalTo;
});