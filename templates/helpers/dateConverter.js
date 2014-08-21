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
					retval = (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
				break;
				case "month/yyyy":
					retval = months[date.getMonth()] + " - " + date.getFullYear();
				break;
				default:
					retval = (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
				break;
			}
			
			return retval;
		}
	
	Handlebars.registerHelper('dateConverter', dateConverter);
	return dateConverter;
});	