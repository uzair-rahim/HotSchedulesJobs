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

			if(typeof type  === "undefined"){
				type = defaultType;
			}

			switch(type){
				case "mm/dd/yyyy":
					retval = (date.getUTCMonth()+1)+"/"+date.getUTCDate()+"/"+date.getUTCFullYear();
				break;
				case "month/yyyy":
					retval = months[date.getUTCMonth()] + " - " + date.getUTCFullYear();
				break;
				case "month date":
					retval = months[date.getUTCMonth()] + " " + date.getUTCDate();
				break;
				case "time":
					var hours = date.getHours();
					var ampm = hours >= 12 ? 'pm' : 'am';
						hours = hours % 12;
						hours = hours ? hours : 12;
					var minutes = date.getMinutes();
						minutes = minutes < 10 ? '0'+minutes : minutes;
					
					retval = hours+":"+minutes+ampm;
				break;
				default:
					retval = (date.getUTCMonth())+"/"+date.getUTCDate()+"/"+date.getUTCFullYear();
				break;
			}
			
			return retval;
		}
	
	Handlebars.registerHelper('dateConverter', dateConverter);
	return dateConverter;
});	