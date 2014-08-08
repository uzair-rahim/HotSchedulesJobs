<div id="sub-nav"></div>

<div id="toolbar" class="support">
	<div class="search-type-container">
		{{#if_not_eq users undefined}}
			<div id="search-type" class="custom-select search-type" data-index="1" data-value="User">
				<button class="custom-select-button">User</button>
		{{else}}
			<div id="search-type" class="custom-select search-type" data-index="0" data-value="Location/Admin">
				<button class="custom-select-button">Location/Admin</button>
		{{/if_not_eq}}
				<ul class="custom-select-list">
					<li id="select-location-admin">Location/Admin</li>
					<li id="select-user">User</li>
				</ul>
			</div>
	</div>
	{{#if_not_eq users undefined}}
		<input id="search-field" type="text" placeholder="Search for Users"/>
	{{else}}
		<input id="search-field" type="text" placeholder="Search for Admins or Employers"/>
	{{/if_not_eq}}

	<button id="search-button" class="primary" style="margin-top:2px;">Search</button>
</div>

{{#if_not_eq admins undefined}}
	<div class="grid-list-head">Employers containing Admins ({{employers.length}})</div>
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
				<button class="destroy employer" id="{{id}}" data-guid="{{guid}}">Delete</button>
			</li>
		{{/each}}
	{{/if_eq}}
	</ul>

	<div class="grid-list-head">Admins ({{admins.length}})</div>
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
				<button class="destroy admin" id="{{admin.id}}" data-guid="{{admin.guid}}" data-employer="{{employer.guid}}">Remove As Admin</button>
			</li>
		{{/each}}
	{{/if_eq}}
	</ul>	
{{/if_not_eq}}


{{#if_not_eq users undefined}}
	<div class="grid-list-head">Users ({{users.length}})</div>
	<ul class="grid-list support">
	{{#if_eq users.length 0}}
		<li class="no-result">No Results</li>
	{{else}}
		{{#each users}}
			<li>
				<div class="photo">
					{{#isNotNull photo}}
						<img src="{{photo.url}}"/>
					{{/isNotNull}}
				</div>
				<div class="info">
					<div class="name">{{firstname}} {{lastname}}</div>
					{{#isNotNull primaryWorkHistory}}
						<div class="employer">{{primaryWorkHistory.jobs.[0].jobName}} @ {{primaryWorkHistory.employer.name}}</div>
					{{/isNotNull}}
					<div class="email">{{email}}</div>
				</div>
				<button class="destroy user" id="{{id}}" data-guid="{{guid}}">Deactivate</button>
			</li>
		{{/each}}
	{{/if_eq}}
	</ul>	
{{/if_not_eq}}