<div id="sub-nav"></div>

<div id="toolbar">
	<input id="search-field" type="text" style="float:left; width: 190px;" placeholder="Search for Users or Stores" value="Moonshine"/>
	<button id="search-button" class="primary" style="margin-top:2px;">Search</button>
</div>

{{#if_not_eq results undefined}}

	<div class="grid-list-head">Employers</div>
	<ul class="grid-list support">
	{{#if_eq results.length 0}}
		<li class="no-result">No Results</li>
	{{else}}
		{{#each results}}
			<li>
				<div class="logo">
					{{#hasPhoto attributes.user.logo}}
						<img src="{{attributes.user.logo}}"/>
					{{/hasPhoto}}
				</div>
				<div class="info">
					<div class="name">{{attributes.employer.name}}</div>
					<div class="email">{{attributes.employer.location}}</div>
				</div>
				<button class="destroy" id="{{attributes.employer.id}}" data-guid="{{attributes.employer.guid}}">Remove</button>
			</li>
		{{/each}}
	{{/if_eq}}
	</ul>


	<div class="grid-list-head">Admins</div>
	<ul class="grid-list support">
	{{#if_eq results.length 0}}
		<li class="no-result">No Results</li>
	{{else}}
		{{#each results}}
			<li>
				<div class="photo">
					{{#hasPhoto attributes.user.photo}}
						<img src="{{attributes.user.photo}}"/>
					{{/hasPhoto}}
				</div>
				<div class="info">
					<div class="name">{{attributes.user.firstname}} {{attributes.user.lastname}}</div>
					<div class="employer">@ {{attributes.employer.name}}</div>
					<div class="email">{{attributes.user.email}}</div>
				</div>
				<button class="destroy" id="{{attributes.admin.id}}" data-guid="{{attributes.admin.guid}}" data-employer="{{attributes.employer.guid}}">Remove</button>
			</li>
		{{/each}}
	{{/if_eq}}
	</ul>
{{else}}
	
{{/if_not_eq}}