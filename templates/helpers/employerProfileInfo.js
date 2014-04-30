define([
	'Handlebars'
],
	function (Handlebars){

		function employerProfileInfo(object, attribute, type){

			var returnVal = ""

			switch(attribute){
				case "name":
					if(typeof object.name === "undefined"){
						if(type === "value"){
							returnVal = "Please provide a name";
						}else{
							returnVal = "empty"	
						}
					}else{
						returnVal = object.name;
					}
				break;
				case "address":
					if(typeof object.location === "undefined"){
						if(type === "value"){
							returnVal = "Please provide an address";
						}else{
							returnVal = "empty"	
						}
					}else{
						returnVal = object.location.address1 + ", " + object.location.city + " " + object.location.state + " " +object.location.zip;
					}
				break;
				case "description":
					if(typeof object.description === "undefined"){
						if(type === "value"){
							returnVal = "Tell us a little about your store";
						}else{
							returnVal = "empty"	
						}
					}else{
						returnVal = object.description;
					}
				break;
				case "website":
					if(typeof object.url === "undefined"){
						if(type === "value"){
							returnVal = "Please provide your website url";
						}else{
							returnVal = "empty"	
						}
					}else{
						returnVal = object.url;
					}
				break;
				case "email":
					if(typeof object.email === "undefined"){
						if(type === "value"){
							returnVal = "Please provide an email"
						}else{
							returnVal = "empty"	
						}
					}else{
						returnVal = object.email;
					}
				break;
				case "phone":
					if(typeof object.phone === "undefined"){
						if(type === "value"){
							returnVal = "Please provide your phone";
						}else{
							returnVal = "empty"	
						}
					}else{
						returnVal = object.phone;
					}
				break;
				}

			return returnVal;

		};
	
	Handlebars.registerHelper('employerProfileInfo', employerProfileInfo);
	return employerProfileInfo;
	
});	