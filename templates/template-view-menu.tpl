<div class="user-info">
		<div class="employer-logo">
			{{#ifEmployerHasLogo user selectedEmployer}}
				<img src="{{getEmployerLogo user selectedEmployer}}"/>
			{{/ifEmployerHasLogo}}
		</div>
	<div class="user-name">{{user.firstname}} {{user.lastname}}</div>
	<div class="employer-name {{#if_gt user.employers.length 1}}more{{/if_gt}}">{{getEmployerName user selectedEmployer}}</div>
	{{#if_gt user.employers.length 1}}
		<ul class="employers-list transition">
			{{#each user.employers}}
				{{#if_eq @index ../selectedEmployer}}
					<li class="selected">{{this.name}}</li>
				{{else}}
					<li>{{this.name}}</li>
				{{/if_eq}}
			{{/each}}
		</ul>
	{{/if_gt}}
</div>
<ul class="menu-list">
	<li id="menu-getting-started">
		<label>Getting Started</label>
	</li>
	<li class="divider"></li>
	{{#if_true config.notification}}
	<li id="menu-notifications">
		<label>Notifications</label>
		<div class="count">{{notificationsCount}}</div>
	</li>
	<li class="divider"></li>
	{{/if_true}}
	<li id="menu-candidates">
		<label>Candidates</label>
	</li>
	<li id="menu-jobs">
		<label>Jobs</label>
	</li>
	<li id="menu-network">
		<label>Network</label>
	</li>
	<li id="menu-messages">
		<label>Messages</label>
	</li>
	<li class="divider"></li>
	<li id="menu-settings">
		<label>Settings</label>
	</li>
	<li id="menu-logout">
		<label>Logout</label>
	</li>
	<li class="divider"></li>
</ul>