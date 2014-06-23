<div id="sub-nav">
	<ul id="breadcrumb">
		{{#each breadcrumb}}
			<li>{{this}}</li>
		{{/each}}
	</ul>
</div>

<div id="toolbar">
	<button class="primary" id="save-settings">Save</button>
</div>

<div class="profile-info">
	<div class="settings-heading">Your Account Information</div>
	<div class="employer-profile-container no-border">
		<div class="field-container one-half">
			<label>First Name</label>
			<input type="text" id="firstname" value="{{user.firstname}}" placeholder="First Name" disabled/>
		</div>
		<div class="field-container one-half">
			<label>Last Name</label>
			<input type="text" id="lastname" value="{{user.lastname}}" placeholder="Last Name" disabled/>
		</div>
		<div class="field-container">
			<label>Email Address</label>
			<input type="text" id="emailaddress" value="{{user.emailaddress}}" placeholder="Email Address" disabled/>
		</div>
		<div class="field-container" style="clear:both;">
			<label>Current Password</label>
			<input type="password" id="current" value="" placeholder="Current Password"/>
		</div>
		<div class="field-container one-half" style="clear:left;">
			<label>Change Password</label>
			<input type="password" id="password" value="" placeholder="New Passsword"/>
		</div>
		<div class="field-container one-half">
			<label>Confirm Password</label>
			<input type="password" id="confirm" value="" placeholder="Confirm Password"/>
		</div>
	</div>
</div>