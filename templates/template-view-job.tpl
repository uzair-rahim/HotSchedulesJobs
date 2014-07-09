<div id="job-wrapper">
	<div id="job-card">
		<div id="job-map">
			<div class="fold"></div>
			<div class="fold center"></div>
			<div class="fold"></div>
			<div class="grid-pattern"></div>
			<div id="map-canvas"></div>
		</div>
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
		<div id="job-apps">
			<div id="job-message">Interested in this job? You can get it and more here...</div>
			<div id="google-play" class="google-hspost-scheme"></div>
			<div id="app-store" class="ios-hspost-scheme"></div>
		</div>
	</div>
	<div id="job-footer">
		<div id="hsp-logo"></div>
		<div id="footer-links">
			<a href="#">Learn More</a>
			<a>|</a>
			<a href="#">Other Great Products</a>
			<a>&copy; 1999 - 2014 Red Book Connect LLC. All rights reserved.</a>	
		</div>
	</div>
</div>