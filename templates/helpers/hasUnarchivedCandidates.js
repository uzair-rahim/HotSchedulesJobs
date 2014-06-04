define([
	"Handlebars"
],
	function (Handlebars){
		function hasUnarchivedCandidates(context, options){
			
			var count = 0;
			var candidates = context.candidates;

			for(var i = 0; i < candidates.length; i++){
				if(!candidates[i].archived){
					count++
				}
			}

			if(count > 0){
				return options.fn(this);
			}else{
				return options.inverse(this);
			}

		}
	
	Handlebars.registerHelper('hasUnarchivedCandidates', hasUnarchivedCandidates);
	return hasUnarchivedCandidates;
});	