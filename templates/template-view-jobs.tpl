<div id="sub-nav">
	<ul id="breadcrumb">
		{{#each breadcrumb}}
			<li>{{this}}</li>
		{{/each}}
	</ul>
</div>
<div id="toolbar">
	<button id="add-new-job" class="primary">Add New Job</button>
</div>

<div id="add-job" class="job-information">
	<div class="details">
		<div class="input-container position">
			<label>Position</label>
			<div id="new-position" class="custom-select" data-index="0" data-value="{{jobtypes.[0].name}}">
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
		<div class="input-container description">
			<label>Description</label>
			<textarea id="new-description"></textarea>
		</div>
		<div class="input-container referral-bonus">
			<a class="add-referral-bonus">+ Add Referral Bonus</a>
		</div>
		<div class="input-container referral-bonus hidden">
			<label>Referral Bonus</label>
			<div class="dollar">$</div>
			<input id="new-bonus" type="text" class="bonus"/>
		</div> 
	</div>
	<div class="actions">
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
				{{#hasUnarchivedCandidates this}}
					<div class="link">{{totalUnarchivedCandidatesByJob this}} Candidate{{#if_gt this.candidates.length 1}}s{{/if_gt}}</div>
				{{else}}
					<div class="link no">No Candidates</div>
				{{/hasUnarchivedCandidates}}
			</div>
			<!--<div class="share-info">0 shares</div>-->
			<div class="bonus-info {{hasNewCandidates this}}">{{#isNotNull referralBonus}}${{referralBonus}}{{else}}No{{/isNotNull}} Ref. Bonus</div>
			<div class="posted-info {{hasNewCandidates this}}">Posted {{dateConverter created "mm/dd/yyyy"}}</div>
			<div class="job-actions">				
				<div class="custom-select" data-index="0" data-value="{{status}}">
					<button class="custom-select-button job-status">{{#isNotNull status}}{{status}}{{else}}Unposted{{/isNotNull}}</button>
					<ul class="custom-select-list job-status">
						<li class="post-job">Posted</li>
						<li class="unpost-job">Unposted</li>
						<li class="edit-job">Edit</li>
						<li class="divider"></li>
						{{#if_not_eq status "UNPOSTED"}}
							{{#isNotNull tinyurl}}
								<li class="copy-tiny-url" data-url="{{tinyurl}}">Copy Job Link</li>
							{{else}}
								<li class="copy-tiny-url disabled">Copy Job Link</li>
							{{/isNotNull}}
						{{else}}
							<li class="copy-tiny-url disabled">Copy Job Link</li>
						{{/if_not_eq}}
						{{#if_not_eq status "UNPOSTED"}}
							<li class="share-with-connections active">Share with Connections</li>
						{{else}}
							<li class="share-with-connections disabled">Share with Connections</li>
						{{/if_not_eq}}
						{{#if_not_eq status "UNPOSTED"}}
							<li class="share-with-employees active">Share with Employees</li>
						{{else}}
							<li class="share-with-employees disabled">Share with Employees</li>
						{{/if_not_eq}}
						{{#if_not_eq status "UNPOSTED"}}
							<li class="share-with-followers active">Share with Followers</li>
						{{else}}
							<li class="share-with-followers disabled">Share with Followers</li>
						{{/if_not_eq}}
						<!--
						<li class="divider"></li>
						<li class="delete-job">Delete</li>
						-->
					</ul>
				</div>
			</div>
			<div class="count {{hasNewCandidates this}}">{{totalUnarchivedCandidatesByJob this}}</div>
			<div class="edit-mode job-information">
				<div class="details">
					<div class="input-container position">
						<label>Position</label>
						<div class="custom-select job-position" data-index="0" data-value="{{jobName}}">
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
					<div class="input-container description">
						<label>Description</label>
						<textarea class="job-description">{{description}}</textarea>
					</div>
					{{#isNotNull referralBonus}}
						<div class="input-container referral-bonus">
							<label>Referral Bonus</label>
							<div class="dollar">$</div>
							<input type="text" class="bonus" value="{{referralBonus}}"/>
						</div>
					{{else}}
						<div class="input-container referral-bonus">
							<a class="add-referral-bonus">+ Add Referral Bonus</a>
						</div>
						<div class="input-container referral-bonus hidden">
							<label>Referral Bonus</label>
							<div class="dollar">$</div>
							<input type="text" class="bonus" value="{{referralBonus}}"/>
						</div>
					{{/isNotNull}}
				</div>
				<div class="actions">
					<button class="primary save-job">Save</button>
					<button class="cancel-edit">Cancel</button>
				</div>
			</div>
		</li>
	{{/each}}
</ul>				