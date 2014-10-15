<div id="nav-logo"></div>
<div id="nav-button">Jobs</div>
<ul id="nav-menu">
	<li id="jobs">Jobs</li>
	<li id="candidates">Candidates</li>
	<li id="network">Network</li>
</ul>
<ul id="nav-icons">
	<li id="messages"></li>
	<li id="settings"></li>
</ul>
<div id="nav-user">{{username}}</div>
<ul id="settings-flyout" class="nav-flyout">
	<li id="account-settings">Account Settings</li>
	<li id="profile-settings">Profile Settings</li>
	<li class="divider"></li>
		<div id="stores-list" class="scrollable">
			{{#each employers}}
				<li class="store">{{this.name}}</li>
			{{/each}}
		</div>
	<li class="divider"></li>
	<li id="getting-started">Getting Started</li>
	<li id="terms-conditions">Terms and Conditions</li>
	<li id="logout">Logout</li>
</ul>