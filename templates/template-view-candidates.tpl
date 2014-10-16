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
	<button id="send-chat" class="primary" disabled>{{language.sendMessage}}</button>
	<button id="archive-candidates" disabled>{{language.archiveCandidates}}</button>
</div>

<div id="filter-flyout" class="flyout">
	<h1>{{language.filterCandidates}}</h1>
	<a id="clear" class="clear-all">{{language.clearAll}}</a>
	<div class="filter-section">
		<label>{{language.position}}</label>
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
				<label for="archived-candidates">{{language.archivedCandidates}}</label>		
			</li>
		</ul>
	</div>
	<div class="button-group">
		<button id="search-filter" class="primary">{{language.search}}</button>
		<a id="cancel-filter">{{language.cancel}}</a>
	</div>
</div>

<div class="candidates-list-container">
	{{#each jobs}}
		<div class="candidate-section" id="{{jobType.guid}}">
			{{#hasUnarchivedCandidates this}}
				<div class="grid-list-head">{{jobName}} ({{totalUnarchivedCandidatesByJob this}})</div>
				<ul id="candidates-list" class="grid-list" data-id="{{id}}" data-guid="{{guid}}">
				{{#each candidates}}
					{{#if_eq archived false}}
						<li class="view-profile" data-id="{{id}}" data-guid="{{guid}}" data-user="{{user.guid}}" data-email="{{user.email}}">
							<input class="candidate-select" type="checkbox"/>
							<div class="candidate-picture">
								{{#isNotNull this.user.photo}}
									<img src="{{this.user.photo.url}}"/>
								{{/isNotNull}}
							</div>
							<div class="candidate-info">
								<div class="candidate-name {{#if_eq seen false}}new{{/if_eq}}">{{user.firstname}} {{user.lastname}}</div>
								<div class="candidate-job">{{#hasPrimaryWorkHistory user.primaryWorkHistory}}{{user.primaryWorkHistory.jobs.[0].jobName}} @ {{user.primaryWorkHistory.employer.name}}{{else}}Not Available{{/hasPrimaryWorkHistory}}</div>
							</div>
							<div class="user-actions">
								<div class="custom-select user-dropdown" data-index="0" data-value="">
									{{#if_eq hired true}}
										<button class="custom-select-button create">Hired</button>
									{{else}}
										<button class="custom-select-button">Candidate</button>
									{{/if_eq}}
									<ul class="custom-select-list user-dropdown">
									{{#if_eq hired true}}
										<li class="hire-candidate hired">Candidate</li>
									{{else}}
										<li class="hire-candidate">Hire</li>
									{{/if_eq}}
										<li class="archive-candidate">Archive</li>
										<li class="divider"></li>
										<li class="chat-candidate">Chat</li>
										<li class="connect-candidate">Connect</li>
									</ul>
								</div>
							</div>
							<div class="candidate-endorse">{{user.endorsementCount}}</div>
							<div class="candidate-network sync">{{#if_gt user.sharedNetworkConnectionCount 500}}500+{{else}}{{user.sharedNetworkConnectionCount}}{{/if_gt}}</div>
							<div class="candidate-referral">{{referralCount}}</div>
							<div class="hourly-profile">
								<div class="about-section">
									<label>About</label>
									{{#isNotNull user.about}}
										<div class="about">{{user.about}}</div>
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
					{{/if_eq}}
				{{/each}}
				</ul>
			{{/hasUnarchivedCandidates}}
		</div>
	{{/each}}
</div>

{{#anyArchivedCandidates jobs sub}}
	<div class="archived-candidates-list-container">
		<div class="grid-list-head">{{language.archived}} ({{totalArchivedCandidates jobs sub}})</div>
		<ul id="archived-candidates-list" class="grid-list">
			{{#each jobs}}
				{{#each candidates}}				
					{{#if_eq archived true}}
						<li class="view-profile" data-id="{{id}}" data-guid="{{guid}}" data-job="{{../../guid}}" data-email="{{user.email}}">
							<div class="candidate-picture">
								{{#isNotNull this.user.photo}}
									<img src="{{this.user.photo.url}}"/>
								{{/isNotNull}}
							</div>
							<div class="candidate-info">
								<div class="candidate-name {{#if_eq seen false}}new{{/if_eq}}">{{user.firstname}} {{user.lastname}}</div>
								<div class="candidate-job">{{#hasPrimaryWorkHistory user.primaryWorkHistory}}{{user.primaryWorkHistory.jobs.[0].jobName}} @ {{user.primaryWorkHistory.employer.name}}{{else}}Not Available{{/hasPrimaryWorkHistory}}</div>
							</div>
							<div class="user-actions">
								<div class="custom-select user-dropdown" data-index="0" data-value="">
									<button class="custom-select-button">Archived</button>
									<ul class="custom-select-list user-dropdown">
										<li class="unarchive-candidate">Unarchive</li>
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