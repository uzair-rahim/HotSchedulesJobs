define([
	"hbs/handlebars"
],
	function (Handlebars){
		function countNewCandidates(context){
			
			var count = 0;
			var candidates = context.candidates;

			for(var i = 0; i < candidates.length; i++){
				if(!candidates[i].seen){
					count++
				}
			}

			return count;
		}
	
	Handlebars.registerHelper('countNewCandidates', countNewCandidates);
	return countNewCandidates;
});	