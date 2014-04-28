define([
	"Handlebars"
],
	function (Handlebars){
		function totalUnarchivedCandidatesByJob(context){
			
			var count = 0;
			var candidates = context.candidates;

			for(var i = 0; i < candidates.length; i++){
				if(!candidates[i].archived){
					count++
				}
			}

			return count;

		}
	
	Handlebars.registerHelper('totalUnarchivedCandidatesByJob', totalUnarchivedCandidatesByJob);
	return totalUnarchivedCandidatesByJob;
});	