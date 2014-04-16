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
<ul id="job-list" class="grid-list">
	{{#each jobs}}
		<li>
			<div class="job-info">
				<div class="job-name {{hasNewCandidates this}}">{{jobName}}</div>
				<div class="job-shift">Sun - Thu: Lunch and Dinner</div>
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
					</li>
				</ul>
			{{/if_not_eq}}
			<div class="edit-mode">Edit Mode</div>
		</li>
	{{/each}}
</ul>

<!--
<ul id="job-list" class="grid-list">
	<li>
		<div class="job-info">
			<div class="job-name new">Bartender</div>
			<div class="job-shift">Sun - Thu: Lunch and Dinner</div>
		</div>
		<div class="candidates-info">
			<ul class="candidates-list">
				<li class="new"><img src="images/profiles/Christi.jpg"/></li>
				<li class="new"><img src="images/profiles/Jake.jpg"/></li>
				<li class="new"></li>
				<li class="new"></li>
				<li class="new"></li>
				<li class="new"><img src="images/profiles/Amy.jpg"/></li>
			</ul>
			<div class="more new">+ 5 More</div>
		</div>
		<div class="share-info">2 shares</div>
		<div class="posted-info new">Posted 5:00PM</div>
		<div class="job-actions">
			<button>Posted</button>
			<button class="edit-job">Edit</button>
		</div>
		<div class="count">9</div>
		<ul class="grid-list sub">
			<li class="view-profile">
				<input class="candidate-select" type="checkbox"/>
				<div class="candidate-picture">
					<img src="images/profiles/Christi.jpg"/>
				</div>
				<div class="candidate-info">
					<div class="candidate-name new">Brittney Smith</div>
					<div class="candidate-job">Bartender @ Roaring Fork</div>
				</div>
				<div class="candidate-referral">
					<div class="date new">Wednesday</div>
					<div class="referred-by">
						<div class="picture"><img src="images/profiles/Jake.jpg"/></div>
						<div class="name">Dennis L.</div>
					</div>
				</div>
				<div class="candidate-archive"></div>
				<div class="candidate-message"></div>
				<div class="candidate-rating five"></div>
				<div class="candidate-endorse">0</div>
				<div class="candidate-network"><span>77</span> / 500</div>
			</li>
			<li class="view-profile">
				<input class="candidate-select" type="checkbox"/>
				<div class="candidate-picture">
					<img src="images/profiles/Jake.jpg"/>
				</div>
				<div class="candidate-info">
					<div class="candidate-name new">Ben Scott</div>
					<div class="candidate-job">Bartender @ McDonalds</div>
				</div>
				<div class="candidate-referral">
					<div class="date new">March 1</div>
					<div class="referred-by">
						<div class="picture"><img src="images/profiles/Amy.jpg"/></div>
						<div class="name">Heather A.</div>
					</div>
				</div>
				<div class="candidate-archive"></div>
				<div class="candidate-message"></div>
				<div class="candidate-rating four"></div>
				<div class="candidate-endorse">0</div>
				<div class="candidate-network"><span>77</span> / 500</div>
			</li>
			<li class="view-profile">
				<input class="candidate-select" type="checkbox"/>
				<div class="candidate-picture"></div>
				<div class="candidate-info">
					<div class="candidate-name">Andrew Kipswich</div>
					<div class="candidate-job">Bartender @ Roaring Fork</div>
				</div>
				<div class="candidate-referral">
					<div class="date">Wednesday</div>
				</div>
				<div class="candidate-archive"></div>
				<div class="candidate-message"></div>
				<div class="candidate-rating"></div>
				<div class="candidate-endorse">0</div>
				<div class="candidate-network"><span>77</span> / 500</div>
			</li>
			<li class="view-profile">
				<input class="candidate-select" type="checkbox"/>
				<div class="candidate-picture">
					<img src="images/profiles/Amy.jpg"/>
				</div>
				<div class="candidate-info">
					<div class="candidate-name">Heather Amber</div>
					<div class="candidate-job">Bartender @ McDonalds</div>
				</div>
				<div class="candidate-referral">
					<div class="date">Wednesday</div>
				</div>
				<div class="candidate-archive"></div>
				<div class="candidate-message"></div>
				<div class="candidate-rating five"></div>
				<div class="candidate-endorse">0</div>
				<div class="candidate-network"><span>77</span> / 500</div>
			</li>
			<li class="foot">
				<a class="view-candidates">View All Candidates</a>
			</li>
		</ul>
	</li>

	<li>
		<div class="job-info">
			<div class="job-name new">Hostess</div>
			<div class="job-shift">Mon, Tue: Dinner</div>
		</div>
		<div class="candidates-info">
			<ul class="candidates-list">
				<li><img src="images/profiles/Michael.jpg"/></li>
				<li><img src="images/profiles/Monica.jpg"/></li>
				<li><img src="images/profiles/Ray.jpg"/></li>
			</ul>
		</div>
		<div class="share-info">2 shares</div>
		<div class="posted-info">Posted Wednesday</div>
		<div class="job-actions">
			<button>Posted</button>
			<button class="edit-job">Edit</button>
		</div>
		<div class="count">3</div>
		<ul class="grid-list sub">
			<li class="view-profile">
				<input class="candidate-select" type="checkbox"/>
				<div class="candidate-picture">
					<img src="images/profiles/Michael.jpg"/>
				</div>
				<div class="candidate-info">
					<div class="candidate-name new">Ben Scott</div>
					<div class="candidate-job">Cook @ Roaring Fork</div>
				</div>
				<div class="candidate-referral">
					<div class="date">3/1/13</div>
				</div>
				<div class="candidate-archive"></div>
				<div class="candidate-message"></div>
				<div class="candidate-rating three"></div>
				<div class="candidate-endorse">0</div>
				<div class="candidate-network"><span>77</span> / 500</div>
			</li>
			<li class="view-profile">
				<input class="candidate-select" type="checkbox"/>
				<div class="candidate-picture">
					<img src="images/profiles/Monica.jpg"/>
				</div>
				<div class="candidate-info">
					<div class="candidate-name new">Brittney Smith</div>
					<div class="candidate-job">Bartender @ McDonalds</div>
				</div>
				<div class="candidate-referral">
					<div class="date">3/1/13</div>
				</div>
				<div class="candidate-archive"></div>
				<div class="candidate-message"></div>
				<div class="candidate-rating two"></div>
				<div class="candidate-endorse">0</div>
				<div class="candidate-network"><span>77</span> / 500</div>
			</li>
			<li class="view-profile">
				<input class="candidate-select" type="checkbox"/>
				<div class="candidate-picture">
					<img src="images/profiles/Ray.jpg"/>
				</div>
				<div class="candidate-info">
					<div class="candidate-name new">Christopher Nolan</div>
					<div class="candidate-job">Cook @ CPK</div>
				</div>
				<div class="candidate-referral">
					<div class="date">3/1/13</div>
				</div>
				<div class="candidate-archive"></div>
				<div class="candidate-message"></div>
				<div class="candidate-rating one"></div>
				<div class="candidate-endorse">0</div>
				<div class="candidate-network"><span>77</span> / 500</div>
			</li>
			<li class="foot">
				<a class="view-candidates">View All Candidates</a>
			</li>
		</ul>
	</li>

	<li>
		<div class="job-info">
			<div class="job-name">Driver</div>
			<div class="job-shift">Mon - Fri: Dinner</div>
		</div>
		<div class="candidates-info">
			<div class="more">No Candidates</div>
		</div>
		<div class="share-info">0 shares</div>
		<div class="posted-info">Posted 3/24/2014</div>
		<div class="job-actions">
			<button>Posted</button>
			<button class="edit-job">Edit</button>
		</div>
	</li>
	
</ul>
-->