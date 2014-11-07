<div class="job-info">
	<div class="job-name">{{name}}</div>
	<div class="job-shift">{{wage}}</div>
</div>
<div class="candidates-info">
	{{#if_true hasCandidates}}
		<div class="link">{{candidates}} Candidates</div>
	{{else}}
		<div class="link no">No Candidates</div>
	{{/if_true}}		
</div>
<div class="bonus-info">{{bonus}}</div>
<div class="posted-info">{{posted}}</div>
<div class="count">{{candidates}}</div>