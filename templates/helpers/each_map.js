define([
        'Handlebars'
], function ( Handlebars ) {
	
	function each_map(map, options) {
	    var buffer = "";
	    
	    $.each(map,function(key, value){
	    	buffer += options.fn(value);
	    });
 
	    return buffer;
	};

	Handlebars.registerHelper("each_map", each_map);
	
	return each_map;
});