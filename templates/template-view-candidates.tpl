<div id="sub-nav">
	<ul id="breadcrumb">
		{{#each breadcrumb}}
			<li>{{this}}</li>
		{{/each}}
	</ul>
</div>

<div id="toolbar">
	<button id="send-message" class="primary">Send Message</button>
	<button id="archive-candidates">Archive Candidates</button>
</div>

{{#each jobs}}
	{{#if_gt candidates.length 0}}
		<div class="grid-list-head">{{jobName}} ({{candidates.length}})</div>
		<ul id="candidates-list" class="grid-list">
		{{#each candidates}}
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
		</ul>
	{{/if_gt}}
{{/each}}

<!--
<div class="grid-list-head">Cook</div>
<ul id="candidates-list" class="grid-list">
	<li class="view-profile">
		<input class="candidate-select" type="checkbox"/>
		<div class="candidate-picture">
			<img src="images/profiles/Christi.jpg"/>
		</div>
		<div class="candidate-info">
			<div class="candidate-name new">Brittney Smith</div>
			<div class="candidate-job">Cook @ Roaring Fork</div>
		</div>
		<div class="candidate-referral">
			<div class="date new">Wednesday</div>
			<div class="referred-by">
				<div class="picture"><img src="images/profiles/Kim.jpg"/></div>
				<div class="name">Yuan L.</div>
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
</ul>


<div class="grid-list-head">Bartender</div>
<ul id="candidates-list" class="grid-list">
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
			<div class="date">March 1</div>
			<div class="referred-by">Sunday</div>
		</div>
		<div class="candidate-archive"></div>
		<div class="candidate-message"></div>
		<div class="candidate-rating four"></div>
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

</ul>
-->