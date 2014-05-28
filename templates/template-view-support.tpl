<div id="sub-nav"></div>

<div id="toolbar">
	<input id="search-field" type="text" style="float:left; width: 190px;" placeholder="Search for Users or Stores"/>
	<button id="search-button" class="primary" style="margin-top:2px;">Search</button>
</div>

{{#if_not_eq results undefined}}
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
				<button class="destroy" id="{{attributes.admin.id}}" data-guid="{{attributes.admin.guid}}" data-employer="{{attributes.employer.guid}}">Delete</button>
			</li>
		{{/each}}
	{{/if_eq}}
	</ul>
{{else}}
	
{{/if_not_eq}}