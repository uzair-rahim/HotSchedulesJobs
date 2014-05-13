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
	<button id="archive-candidates">Archive Candidates</button>
</div>

<div id="filter-flyout" class="flyout">
	<h1>Filter Candidates</h1>
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
				<input id="archived-candidates" type="checkbox"/>
				<label for="archived-candidates">Archived Candidates</label>		
			</li>
		</ul>
	</div>
	<div class="button-group">
		<button id="search-filter" class="primary">Search</button>
		<a id="cancel-filter">Cancel</a>
	</div>
</div>

<div class="candidates-list-container">
	{{#each jobs}}
		<div class="candidate-section" id="{{jobType.guid}}">
			{{#if_gt candidates.length 0}}
				<div class="grid-list-head">{{jobName}} ({{totalUnarchivedCandidatesByJob this}})</div>
				<ul id="candidates-list" class="grid-list" data-id="{{id}}" data-guid="{{guid}}">
				{{#each candidates}}
					{{#if_eq archived false}}
						<li class="view-profile" data-id="{{id}}" data-guid="{{guid}}">
							<input class="candidate-select" type="checkbox"/>
							<div class="candidate-picture">
								{{#hasPhoto this.user.photo.url}}
									<img src="{{this.user.photo.url}}"/>
								{{/hasPhoto}}
							</div>
							<div class="candidate-info">
								<div class="candidate-name {{#if_eq seen false}}new{{/if_eq}}">{{user.firstname}} {{user.lastname}}</div>
								<div class="candidate-job">Not Available</div>
							</div>
							<div class="candidate-referral">
								<div class="date {{#if_eq seen false}}new{{/if_eq}}">{{dateConverter created}}</div>
								<div class="referred-by">
									<div class="picture"></div>
									<div class="name">Not Available</div>
								</div>
							</div>
							<div class="candidate-archive"></div>
							<div class="candidate-message"></div>
							<div class="candidate-rating"></div>
							<div class="candidate-endorse">0</div>
							<div class="candidate-network"><span>0</span> / 0</div>
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
					{{/if_eq}}
				{{/each}}
				</ul>
			{{/if_gt}}
		</div>
	{{/each}}
</div>


{{#anyArchivedCandidates jobs sub}}
	<div class="archived-candidates-list-container">
		<div class="grid-list-head">Archived ({{totalArchivedCandidates jobs sub}})</div>
		<ul id="archived-candidates-list" class="grid-list">
			{{#each jobs}}
				{{#each candidates}}
					{{#if_eq archived true}}
						<li class="view-profile" data-id="{{id}}" data-guid="{{guid}}" data-job="{{../../guid}}">
							<input class="candidate-select" type="checkbox"/>
							<div class="candidate-picture">
								{{#hasPhoto this.user.photo.url}}
									<img src="{{this.user.photo.url}}"/>
								{{/hasPhoto}}
							</div>
							<div class="candidate-info">
								<div class="candidate-name {{#if_eq seen false}}new{{/if_eq}}">{{user.firstname}} {{user.lastname}}</div>
								<div class="candidate-job">Not Available</div>
							</div>
							<div class="candidate-referral">
								<div class="date {{#if_eq seen false}}new{{/if_eq}}">{{dateConverter created}}</div>
								<div class="referred-by">
									<div class="picture"></div>
									<div class="name">Not Available</div>
								</div>
							</div>
							<div class="candidate-unarchive"></div>
							<div class="candidate-message"></div>
							<div class="candidate-rating"></div>
							<div class="candidate-endorse">0</div>
							<div class="candidate-network"><span>0</span> / 0</div>
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
					{{/if_eq}}
				{{/each}}
			{{/each}}
		</ul>
	</div>
{{/anyArchivedCandidates}}