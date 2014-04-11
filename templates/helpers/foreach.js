define([
        'Handlebars'
], function ( Handlebars ) {
	
	function forEach(arr, options) {
		if(options.inverse && !arr.length)
	        return options.inverse(this);
	    return arr.map(function(item,index) {
	    	var newItem = (typeof item === 'string') ? new String(item) : item;
	        newItem.$index = index;
	        newItem.$first = index === 0;
	        newItem.$last  = index === arr.length-1;
	        newItem.$middle = index !== 0 && index !== arr.length-1;
	        return options.fn(newItem);
	    }).join('');
	}
	Handlebars.registerHelper( 'foreach', forEach );
	return forEach;
});	