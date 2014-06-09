<div id="app-alert" class="copy-link-alert">
	<div class="alert-title">Copy Link</div>
	<div class="alert-message">Select the link below and copy it</div>
	<div class="alert-body">
		<input type="text" class="jobURL" value=""/>
	</div>
	<div class="alert-action single">
		<button id="close-copy-link">Close</button>
	</div>
</div>

<div id="app-alert" class="referral-list">
	<div class="alert-title">Candidate's Referrals</div>
	<div class="alert-segmented-control">
		<div id="segmented-referrals" class="tab left selected">Referrals</div>
		<div id="segmented-pending" class="tab right">Pending</div>
	</div>
	<div class="alert-body">
		<div class="list"></div>
	</div>
	<div class="alert-action single">
		<button id="close-referral-list">Close</button>
	</div>
</div>

<div id="sub-nav">
	<ul id="breadcrumb">
		{{#each breadcrumb}}
			<li>{{this}}</li>
		{{/each}}
	</ul>
</div>
<div id="toolbar">
	<button id="add-new-job" class="primary">Add New Job</button>
	<button id="archive-candidates">{{language.archiveCandidates}}</button>
</div>

<div id="add-job" class="add-job">
	<div class="job-details">
		<div class="input-container position">
			<label>Position</label>
			<div id="new-position" class="custom-select position" data-index="0" data-value="{{jobs.[0].jobName}}">
				<button class="custom-select-button">{{jobtypes.[0].name}}</button>
				<ul class="custom-select-list">
					{{#each jobtypes}}
						<li id="{{guid}}">{{name}}</li>
					{{/each}}
				</ul>
			</div>
		</div>
		<div class="input-container">
			<label>Wage</label>
			<div class="dollar">$</div>
			<input id="new-wage" type="text" class="wage" value=""/>
		</div>
		<div class="input-container">
			<label>Frequency</label>
			<div id="new-wage-type" class="custom-select wage-type" data-index="0" data-value="Hourly">
				<button class="custom-select-button">Hourly</button>
				<ul class="custom-select-list">
					<li>Hourly</li>
					<li>Weekly</li>
					<li>Biweekly</li>
					<li>Monthly</li>
					<li>Annually</li>
				</ul>
			</div>
		</div>
	</div>
	<div class="job-description">
		<label>Description</label>
		<textarea id="new-description" class="description"></textarea>
	</div>
	<div class="add-actions">
		<button id="save-add" class="primary">Save</button>
		<button id="cancel-add">Cancel</button>	
	</div>
</div>

<ul id="job-list" class="grid-list">
	{{#each jobs}}
		<li data-id="{{id}}" data-guid="{{guid}}">
			<div class="job-info">
				<div class="job-name {{hasNewCandidates this}}">{{jobName}}</div>
				<div class="job-shift">@ ${{formatCurrency wage}} / {{wageType}}</div>
			</div>
			<div class="candidates-info">
				{{#if_not_eq this.candidates.length 0}}
					<ul class="candidates-list">
						{{#each this.candidates}}
							{{#if_eq this.archived false}}
								<li class="{{#if_eq seen false}}new{{/if_eq}}">
									{{#hasPhoto this.user.photo.url}}
										<img src="{{this.user.photo.url}}"/>
									{{/hasPhoto}}
								</li>
							{{/if_eq}}
						{{/each}}
					</ul>
					<div class="more {{hasNewCandidates ../this}}">{{moreCandidates this.candidates}}</div>
				{{else}}
					<div class="more">No Candidates</div>
				{{/if_not_eq}}
			</div>
			<div class="share-info">0 shares</div>
			<div class="posted-info {{hasNewCandidates this}}">Created {{dateConverter created}}</div>
			<div class="job-actions">				
				<div class="custom-select" data-index="0" data-value="Posted">
					<button class="custom-select-button job-status">Posted</button>
					<ul class="custom-select-list job-status">
						<li class="post-job">Posted</li>
						<li class="unpost-job">Unposted</li>
						<li class="delete-job">Delete</li>
						<li class="divider"></li>
						{{#isNotNull tinyurl}}
							<li class="copy-tiny-url" data-url="{{tinyurl}}">Copy Job Link</li>
						{{else}}
							<li class="copy-tiny-url disabled">Copy Job Link</li>
						{{/isNotNull}}
						<li class="share-with-employees disabled">Share with Employees</li>
						<li class="share-with-followers disabled">Share with Followers</li>
					</ul>
				</div>
				<button class="edit-job">Edit</button>
			</div>
			<div class="count {{hasNewCandidates this}}">{{this.candidates.length}}</div>
			{{#if_not_eq this.candidates.length 0}}
				<ul id="candidates-list" class="grid-list sub">
					{{#each this.candidates}}
						{{#if_eq this.archived false}}
							<li class="view-profile" data-id="{{id}}" data-guid="{{guid}}" data-user="{{user.guid}}">
								<input class="candidate-select" type="checkbox"/>
								<div class="candidate-picture">
									{{#hasPhoto this.user.photo.url}}
										<img src="{{this.user.photo.url}}"/>
									{{/hasPhoto}}
								</div>
								<div class="candidate-info">
									<div class="candidate-name {{#if_eq seen false}}new{{/if_eq}}">{{user.firstname}} {{user.lastname}}</div>
									<div class="candidate-job">{{#hasPrimaryWorkHistory user.primaryWorkHistory}}{{user.primaryWorkHistory.jobs.[0].jobName}} @ {{user.primaryWorkHistory.employer.name}}{{else}}Not Available{{/hasPrimaryWorkHistory}}</div>
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
					<li class="foot">
						<a class="view-candidates" id="{{../guid}}">View All Candidates</a>
						<a class="close-candidates">Close</a>
					</li>
				</ul>
			{{/if_not_eq}}
			<div class="edit-mode">
				<div class="job-details">
					<div class="input-container position">
						<label>Position</label>
						<div class="custom-select position" data-index="0" data-value="{{jobName}}">
							<button class="custom-select-button">{{jobName}}</button>
							<ul class="custom-select-list">
								{{#each ../jobtypes}}
									<li id="{{guid}}">{{name}}</li>
								{{/each}}
							</ul>
						</div>
					</div>
					<div class="input-container">
						<label>Wage</label>
						<div class="dollar">$</div>
						<input type="text" class="wage" value="{{wage}}"/>
					</div>
					<div class="input-container">
						<label>Frequency</label>
						<div class="custom-select wage-type" data-index="0" data-value="{{wageType}}">
							<button class="custom-select-button">{{wageType}}</button>
							<ul class="custom-select-list">
								<li>Hourly</li>
								<li>Weekly</li>
								<li>Biweekly</li>
								<li>Monthly</li>
								<li>Annually</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="job-description">
					<label>Description</label>
					<textarea class="description">{{description}}</textarea>
				</div>
				<div class="edit-actions">
					<button class="primary save-job">Save</button>
					<button class="cancel-edit">Cancel</button>
				</div>
			</div>
		</li>
	{{/each}}
</ul>