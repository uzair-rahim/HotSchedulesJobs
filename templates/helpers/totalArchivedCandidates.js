define([
	"Handlebars"
],
	function (Handlebars){
		function totalArchivedCandidates(context){
			
			var count = 0;
			var jobs = context;

			for(var i = 0; i < jobs.length; i++){
				var candidates = jobs[i].candidates;
				for(var j = 0; j < candidates.length; j++){
					if(candidates[j].archived){
						count++;
					}
				}
			}

			return count;

		}
	
	Handlebars.registerHelper('totalArchivedCandidates', totalArchivedCandidates);
	return totalArchivedCandidates;
});	