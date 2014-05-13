define([
	"Handlebars"
],
	function (Handlebars){
		function anyArchivedCandidates(context, sub, options){
			
			var archived = false;
			var jobs = context;
			var length = jobs.length

			if(sub){
				length = jobs.jobs.candidates.length
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
						return options.fn(this);
					}
				}
			}

			return options.inverse(this);

		}
	
	Handlebars.registerHelper('anyArchivedCandidates', anyArchivedCandidates);
	return anyArchivedCandidates;
});	