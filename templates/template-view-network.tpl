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

<div id="toolbar">
	<button id="send-message" class="primary">Send Message</button>
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
	<div class="filter-section">
		<ul class="checkbox-group" style="margin-top:6px;">
			<li>
				<input id="current-employees" type="checkbox"/>
				<label for="current-employees">Current Employees</label>		
			</li>
			<li>
				<input id="business-followers" type="checkbox"/>
				<label for="business-followers">People Following Your Business</label>		
			</li>
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
			<li class="view-profile">
				<input class="candidate-select" type="checkbox"/>
				<div class="candidate-picture">
					{{#hasPhoto this.attributes.photo}}
						<img src="{{this.attributes.photo.url}}"/>
					{{/hasPhoto}}
				</div>
				<div class="candidate-info">
					<div class="candidate-name">{{this.attributes.firstname}} {{this.attributes.lastname}}</div>
					<div class="candidate-job">Not Available</div>
				</div>
				<div class="candidate-message"></div>
				<div class="candidate-endorse">0</div>
				<!--<div class="candidate-network"><span>0</span> / 0</div>-->
				<div class="hourly-profile">
					<div class="about-section">
						<label>About</label>
						<div class="about">This letter may come to you as a surprise but I really prayed to God to help me choose somebody that will be my true partner. My name is Augusto Nandu Savimbi. I am the first son of Mr. Jonas Savinbi, the leader of the UNITA movement in Angola.</div>
					</div>
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
			<li class="view-profile">
				<input class="candidate-select" type="checkbox"/>
				<div class="candidate-picture">
					{{#hasPhoto this.attributes.photo}}
						<img src="{{this.attributes.photo.url}}"/>
					{{/hasPhoto}}
				</div>
				<div class="candidate-info">
					<div class="candidate-name">{{this.attributes.firstname}} {{this.attributes.lastname}}</div>
					<div class="candidate-job">Not Available</div>
				</div>
				<div class="candidate-message"></div>
				<div class="candidate-endorse">0</div>
				<!--<div class="candidate-network"><span>0</span> / 0</div>-->
				<div class="hourly-profile">
					<div class="about-section">
						<label>About</label>
						<div class="about">This letter may come to you as a surprise but I really prayed to God to help me choose somebody that will be my true partner. My name is Augusto Nandu Savimbi. I am the first son of Mr. Jonas Savinbi, the leader of the UNITA movement in Angola.</div>
					</div>
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
				</div>
			</li>
		{{/each}}
	</ul>
</div>
{{/if_gt}}