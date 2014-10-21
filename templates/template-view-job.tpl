<div id="job-wrapper">
	{{#if_eq job.status "POSTED"}}
		<div id="job-card">
	{{else}}
		<div id="job-card" class="unposted">
	{{/if_eq}}
		<div id="job-map">
			<div class="fold"></div>
			<div class="fold center"></div>
			<div class="fold"></div>
			<div class="grid-pattern"></div>
			{{#if_eq job.status "POSTED"}}
				<div id="map-canvas"></div>
			{{else}}
				<div class="message">Job Not Available</div>
			{{/if_eq}}

		</div>
		{{#if_eq job.status "POSTED"}}
			<div id="job-details">
				<div id="job-logo">
					{{#isNotNull job.employer.logo}}
						<img src="{{job.employer.logo.url}}"/>
					{{/isNotNull}}
				</div>
				<div id="job-title">{{job.jobName}}</div>
				<div id="job-restaurant">{{job.employer.name}}</div>
				<div id="job-address">{{job.employer.location.address1}}, {{job.employer.location.city}}, {{job.employer.location.state}} {{job.employer.location.zip}}</div>
			</div>
		{{/if_eq}}
		<div id="job-apps">
		    {{#if_eq job.appliedFor "SUCCESSFUL"}}
		        <div id="job-message">You have successfully submitted yourself to this job!</div>
		    {{else}}
		        {{#if_eq job.appliedFor "FAILED"}}
		            {{#if_eq job.status "POSTED"}}
		                <div id="job-message">Sorry, there was a problem submitting your application to this job. You can try again here...</div>
		            {{else}}
		                <div id="job-message">Sorry, this job is no longer available. You can find your next job here...</div>
		            {{/if_eq}}
		        {{else}}
                    {{#if_eq job.status "POSTED"}}
                        <div id="job-message">Interested in this job? You can get it and more here...</div>
                    {{else}}
                        <div id="job-message">Looking for a restaurant job? You can find'em here...</div>
                    {{/if_eq}}
                {{/if_eq}}
			    <div id="google-play" class="google-hspost-scheme"></div>
			    <div id="app-store" class="ios-hspost-scheme"></div>
			{{/if_eq}}
		</div>
	</div>
	<div id="job-footer">
		<div id="hsp-logo"></div>
		<div id="footer-links">
			<a href="http://www.hotschedulespost.com" target="_blank">Learn More</a>
			<a>|</a>
			<a  href="http://www.redbookconnect.com" target="_blank">Other Great Products</a>
			<a>&copy; 1999 - 2014 Red Book Connect LLC. All rights reserved.</a>	
		</div>
	</div>
</div>