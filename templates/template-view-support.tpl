<div id="sub-nav"></div>

<div id="toolbar" class="support">
	<input id="search-field" type="text" placeholder="Search for Admins of Employers"/>
	<button id="search-button" class="primary" style="margin-top:2px;">Search</button>
</div>

{{#if_not_eq admins undefined}}

	<div class="grid-list-head">Employers containing Admins</div>
	<ul class="grid-list support">
	{{#if_eq employers.length 0}}
		<li class="no-result">No Results</li>
	{{else}}
		{{#each employers}}
			<li>
				<div class="logo">
					{{#isNotNull logo}}
						<img src="{{logo.url}}"/>
					{{/isNotNull}}
				</div>
				<div class="info">
					<div class="name">{{name}}</div>
					<div class="address">{{location.address1}}, {{location.city}}, {{location.state}} {{location.zip}}</div>
				</div>
				<button class="destroy employer" id="{{id}}" data-guid="{{guid}}">Remove</button>
			</li>
		{{/each}}
	{{/if_eq}}
	</ul>

	<div class="grid-list-head">Admins</div>
	<ul class="grid-list support">
	{{#if_eq admins.length 0}}
		<li class="no-result">No Results</li>
	{{else}}
		{{#each admins}}
			<li>
				<div class="photo">
					{{#isNotNull user.photo}}
						<img src="{{user.photo.url}}"/>
					{{/isNotNull}}
				</div>
				<div class="info">
					<div class="name">{{user.firstname}} {{user.lastname}}</div>
					<div class="employer">@ {{employer.name}}</div>
					<div class="email">{{user.email}}</div>
				</div>
				<button class="destroy admin" id="{{admin.id}}" data-guid="{{admin.guid}}" data-employer="{{employer.guid}}">Remove</button>
			</li>
		{{/each}}
	{{/if_eq}}
	</ul>
{{else}}
	
{{/if_not_eq}}