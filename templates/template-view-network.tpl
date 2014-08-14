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
	<button id="share-job" disabled>Share Job</button>
</div>

<div id="filter-flyout" class="flyout">
	<h1>Filter Network</h1>
	<a id="clear" class="clear-all">Clear All</a>
	<div class="filter-section">
		<label>Position</label>
		<ul class="checkbox-group">
			{{#each jobtypes}}
				<li>
					<input id="{{guid}}" type="checkbox"/>
					<label for="{{guid}}">{{name}}</label>
				</li>
			{{/each}}
		</ul>
	</div>
	<div class="button-group">
		<button id="search-filter" class="primary">Search</button>
		<a id="cancel-filter">Cancel</a>
	</div>
</div>

{{#if_gt employees.length 0}}
<div id="employees-list-container">
	<div class="grid-list-head">Current Employees ({{employees.length}})</div>
	<ul id="employees-list" class="grid-list top">
		{{#each employees}}
			<li class="view-profile" data-email="{{this.attributes.email}}" data-guid="{{this.attributes.guid}}">
				<input class="candidate-select" type="checkbox"/>
				<div class="candidate-picture">
					{{#hasPhoto this.attributes.photo}}
						<img src="{{this.attributes.photo.url}}"/>
					{{/hasPhoto}}
				</div>
				<div class="candidate-info">
					<div class="candidate-name">{{this.attributes.firstname}} {{this.attributes.lastname}}</div>
					<div class="candidate-job">{{#hasPrimaryWorkHistory this.attributes.primaryWorkHistory}}{{this.attributes.primaryWorkHistory.jobs.[0].jobName}} @ {{this.attributes.primaryWorkHistory.employer.name}}{{else}}{{../../language.notAvailable}}{{/hasPrimaryWorkHistory}}</div>
				</div>
				<div class="candidate-message"></div>
				<!--<div class="candidate-endorse">0</div>-->
				<div class="candidate-network sycn"></div>
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
{{/if_gt}}


{{#if_gt followers.length 0}}
<div id="followers-list-container">
	<div class="grid-list-head">People Following Your Business ({{followers.length}})</div>
	<ul id="followers-list" class="grid-list top">
		{{#each followers}}
			<li class="view-profile" data-email="{{this.attributes.email}}" data-guid="{{this.attributes.guid}}">
				<input class="candidate-select" type="checkbox"/>
				<div class="candidate-picture">
					{{#hasPhoto this.attributes.photo}}
						<img src="{{this.attributes.photo.url}}"/>
					{{/hasPhoto}}
				</div>
				<div class="candidate-info">
					<div class="candidate-name">{{this.attributes.firstname}} {{this.attributes.lastname}}</div>
					<div class="candidate-job">{{#hasPrimaryWorkHistory this.attributes.primaryWorkHistory}}{{this.attributes.primaryWorkHistory.jobs.[0].jobName}} @ {{this.attributes.primaryWorkHistory.employer.name}}{{else}}{{../../language.notAvailable}}{{/hasPrimaryWorkHistory}}</div>
				</div>
				<div class="candidate-message"></div>
				<!--<div class="candidate-endorse">0</div>-->
				<div class="candidate-network sycn"></div>
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
{{/if_gt}}