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
		<div class="picture-container">
			<div class="picture">
				{{#hasPhoto employerProfile.logo}}
					<img id="logo" src="{{employerProfile.logo.url}}?{{bust}}"/>
				{{/hasPhoto}}
			</div>
			<div class="picture-action-container">
				<div id="picture-action" class="custom-select" data-index="0" data-value="0">
					<button class="custom-select-button">Update Picture</button>
					<ul class="custom-select-list">
						<li id="upload-picture">Update Picture</li>
						<li id="remove-picture">Remove Picture</li>
					</ul>
				</div>
				<div class="allowed-types">.jpg, .jpeg, .gif, .png</div>
				<form enctype="multipart/form-data" data-remote="true">
					<input type="file" id="picture-file" name="file" accept="image/jpg,image/jpeg,image/gif,image/png"/>
				</form>
			</div>
		</div>
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
		<div class="field-container">
			<label>Current Password</label>
			<input type="password" id="current" value="" placeholder="Current Password"/>
		</div>
		<div class="field-container">
			<label>New Password</label>
			<input type="password" id="password" value="" placeholder="New Passsword (8 characters min)"/>
		</div>
		<div class="field-container">
			<label>Confirm Password</label>
			<input type="password" id="confirm" value="" placeholder="Confirm Password"/>
		</div>
	</div>
</div>