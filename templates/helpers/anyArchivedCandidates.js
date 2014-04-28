define([
	"Handlebars"
],
	function (Handlebars){
		function anyArchivedCandidates(context, options){
			
			var archived = false;
			var jobs = context;

			for(var i = 0; i < jobs.length; i++){
				var candidates = jobs[i].candidates;
				for(var j = 0; j < candidates.length; j++){
					if(candidates[j].archived){
						return options.fn(this);
					}
				}
			}

			return options.inverse(this);

		}
	
	Handlebars.registerHelper('anyArchivedCandidates', anyArchivedCandidates);
	return anyArchivedCandidates;
});	