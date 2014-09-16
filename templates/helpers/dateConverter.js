define([
	"hbs/handlebars"
],
	function (Handlebars){
		function dateConverter(given,type){

			var date = new Date(given);
			var defaultType = "mm/dd/yyyy";
			var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
			var	retval = "";
						
			if(typeof(type) === "undefined"){
				type = defaultType;
			}

			switch(type){
				case "mm/dd/yyyy":
					retval = (date.getUTCMonth()+1)+"/"+date.getUTCDate()+"/"+date.getUTCFullYear();
				break;
				case "month/yyyy":
					retval = months[date.getUTCMonth()+1] + " - " + date.getUTCFullYear();
				break;
				default:
					retval = (date.getUTCMonth()+1)+"/"+date.getUTCDate()+"/"+date.getUTCFullYear();
				break;
			}
			
			return retval;
		}
	
	Handlebars.registerHelper('dateConverter', dateConverter);
	return dateConverter;
});	