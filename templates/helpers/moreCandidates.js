define([
	"hbs/handlebars"
],
	function (Handlebars){
		function moreCandidates(context){
			
			var count = 0;

			for(var i = 0; i < context.length; i++){
				if(!context[i].archived){
					count++
				}
			}

			if(count > 4){
				return "+" + (4-count)*(-1) + " more";
			}else{
				return "";
			}
			
		}
	
	Handlebars.registerHelper('moreCandidates', moreCandidates);
	return moreCandidates;
});	