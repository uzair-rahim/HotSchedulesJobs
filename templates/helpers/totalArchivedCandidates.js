define([
	"hbs/handlebars"
],
	function (Handlebars){
		function totalArchivedCandidates(context, sub){
			
			var count = 0;
			var jobs = context;
			var length = jobs.length

			if(sub){
				length = 1;
			}

			for(var i = 0; i < length; i++){
				var candidates;

				if(!sub){
					candidates = jobs[i].candidates;
				}else{
					candidates = jobs.jobs.candidates;
				}
				
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