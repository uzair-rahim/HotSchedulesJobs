<div id="sub-nav">
	<ul id="breadcrumb">
		{{#each breadcrumb}}
			<li>{{this}}</li>
		{{/each}}
	</ul>
	<ul id="page-actions">
		<li id="filter"></li>
	</ul>
</div>

<div id="toolbar" class="hideable-toolbar">
	<button id="send-message" class="primary" disabled>Send Message</button>
</div>

<div class="grid-list-head">Shared Connections ({{connections.length}})</div>
<ul id="connections-list" class="grid-list">
	{{#each connections}}
		<li class="view-profile" data-email="{{this.attributes.email}}">
			<input class="candidate-select" type="checkbox"/>
			<div class="candidate-picture">
				{{#hasPhoto this.attributes.photo.url}}
					<img src="{{this.attributes.photo.url}}"/>
				{{/hasPhoto}}
			</div>
			<div class="candidate-info">
				<div class="candidate-name">{{this.attributes.firstname}} {{this.attributes.lastname}}</div>
				<div class="candidate-job">{{#hasPrimaryWorkHistory this.attributes.primaryWorkHistory}}{{this.attributes.primaryWorkHistory.jobs.[0].name}} @ {{this.attributes.primaryWorkHistory.employer.name}}{{else}}{{../../language.notAvailable}}{{/hasPrimaryWorkHistory}}</div>
			</div>
			<div class="candidate-message"></div>
			<!--<div class="candidate-endorse">0</div>-->
			<!--<div class="candidate-network"><span>0</span> / 0</div>-->
			<div class="hourly-profile">
				<div class="about-section">
					<label>About</label>
					<div class="about">This letter may come to you as a surprise but I really prayed to God to help me choose somebody that will be my true partner. My name is Augusto Nandu Savimbi. I am the first son of Mr. Jonas Savinbi, the leader of the UNITA movement in Angola.</div>
				</div>
				<!--
				<div class="history-section">
					<label>Work History</label>
					<ul class="work-history">
						<li>
							<div class="employer-logo">
								<img src="images/profiles/PFChangs.jpg"/>
							</div>
							<div class="employment-info">
								<div class="employer-name">Bartender<span>@ PF Changs</span></div>
								<div class="employment-date">Sep 2012 - Feb 2014</div>
							</div>
						</li>
						<li>
							<div class="employer-logo">
								<img src="images/profiles/McDonalds.jpg"/>
							</div>
							<div class="employment-info">
								<div class="employer-name">Bartender<span>@ McDonalds</span></div>
								<div class="employment-date">Oct 2009 - Jul 2012</div>
							</div>
						</li>
					</ul>
				</div>
				-->
			</div>
		</li>
	{{/each}}
</ul>