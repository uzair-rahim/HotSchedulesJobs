define([
	"Handlebars"
],
	function (Handlebars){
		function hasNewCandidates(context){
			
			var status = "";
			var candidates = context.candidates;

			for(var i = 0; i < candidates.length; i++){
				if(!candidates[i].seen){
					status = "new";
				}
			}

			return status;
		}
	
	Handlebars.registerHelper('hasNewCandidates', hasNewCandidates);
	return hasNewCandidates;
});	