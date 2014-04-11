define([
	'Handlebars'
], 
	function (Handlebars){
		function math(lvalue, operator, rvalue, options){

		    if (arguments.length < 4) {
		        // Operator omitted, assuming "+"
		        options = rvalue;
		        rvalue = operator;
		        operator = "+";
		    }
		        
		    lvalue = parseFloat(lvalue);
		    rvalue = parseFloat(rvalue);
		    if(isNaN(lvalue)) lvalue = 0;
		    if(isNaN(rvalue)) rvalue = 0;
		    
		    return {
		        "+": lvalue + rvalue,
		        "-": lvalue - rvalue,
		        "*": lvalue * rvalue,
		        "/": lvalue / rvalue,
		        "%": lvalue % rvalue
		    }[operator];
		});

	Handlebars.registerHelper("math", math);
	return math;
});