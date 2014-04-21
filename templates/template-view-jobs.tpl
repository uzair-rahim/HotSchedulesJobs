<div id="sub-nav">
	<ul id="breadcrumb">
		{{#each breadcrumb}}
			<li>{{this}}</li>
		{{/each}}
	</ul>
</div>
<div id="toolbar">
	<button id="add-new-job" class="primary">Add New Job</button>
	<button id="archive-candidates">Archive Candidates</button>
</div>

<div id="add-job" class="add-job">
	<div class="job-details">
		<div class="input-container">
			<label>Position</label>
			<div id="new-position" class="custom-select position" data-index="0" data-value="{{jobs.[0].jobName}}">
				<button class="custom-select-button">{{jobs.[0].jobName}}</button>
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
					<li>Bi-Weekly</li>
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
				<div class="job-shift">@ ${{wage}} / {{wageType}}</div>
			</div>
			<div class="candidates-info">
				{{#if_not_eq this.candidates.length 0}}
					<ul class="candidates-list">
						{{#each this.candidates}}
							<li class="{{#if_eq seen false}}new{{/if_eq}}">
								{{#hasPhoto this.user.photo.url}}
									<img src="{{this.user.photo.url}}"/>
								{{/hasPhoto}}
							</li>
						{{/each}}
					</ul>
				{{else}}
					<div class="more">No Candidates</div>
				{{/if_not_eq}}
			</div>
			<div class="share-info">0 shares</div>
			<div class="posted-info {{hasNewCandidates this}}">Created {{dateConverter created}}</div>
			<div class="job-actions">
				<button class="posted">Posted</button>
				<button class="edit-job">Edit</button>
			</div>
			<div class="count {{hasNewCandidates this}}">{{this.candidates.length}}</div>
			{{#if_not_eq this.candidates.length 0}}
				<ul class="grid-list sub">
					{{#each this.candidates}}
						<li class="view-profile">
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
						</li>
					{{/each}}
					<li class="foot">
						<a class="view-candidates" id="{{../guid}}">View All Candidates</a>
						<a class="close-candidates">Close</a>
					</li>
				</ul>
			{{/if_not_eq}}
			<div class="edit-mode">
				<div class="job-details">
					<div class="input-container">
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
								<li>Bi-Weekly</li>
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