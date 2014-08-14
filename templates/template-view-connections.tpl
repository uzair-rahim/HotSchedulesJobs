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

<div class="connections-list-container">
	<div class="grid-list-head">Shared Connections with {{name}} ({{connections.length}})</div>
	<ul id="connections-list" class="grid-list">
		{{#each connections}}
			<li class="view-profile" data-email="{{this.attributes.email}}", data-guid="{{this.attributes.guid}}">
				<input class="candidate-select" type="checkbox"/>
				<div class="candidate-picture">
					{{#hasPhoto this.attributes.photo.url}}
						<img src="{{this.attributes.photo.url}}"/>
					{{/hasPhoto}}
				</div>
				<div class="candidate-info">
					<div class="candidate-name">{{this.attributes.firstname}} {{this.attributes.lastname}}</div>
					<div class="candidate-job">{{#hasPrimaryWorkHistory this.attributes.primaryWorkHistory}}{{this.attributes.primaryWorkHistory.jobs.[0].jobName}} @ {{this.attributes.primaryWorkHistory.employer.name}}{{else}}{{../../language.notAvailable}}{{/hasPrimaryWorkHistory}}</div>
				</div>
				<div class="candidate-message"></div>
				<!--<div class="candidate-endorse">0</div>-->
				<!--<div class="candidate-network"><span>0</span> / 0</div>-->
				<div class="hourly-profile">
					<div class="about-section">
						<label>About</label>
						{{#isNotNull this.attributes.about}}
							<div class="about">{{this.attributes.about}}</div>
						{{else}}
							<div class="about">Not Available</div>
						{{/isNotNull}}
					</div>
					<div class="history-section">
						<label>Work History</label>
						<ul class="work-history"></ul>
					</div>
				</div>
			</li>
		{{/each}}
	</ul>
</div>