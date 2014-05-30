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
	<div class="settings-heading">Store Profile Information</div>
	<div class="employer-profile-container">
		<div class="logo-container">
			<div class="logo">
				{{#hasPhoto employerProfile.logo}}
					<img id="logo" src="{{employerProfile.logo.url}}"/>
				{{/hasPhoto}}
			</div>
			<div id="logo-action" class="custom-select" data-index="0" data-value="0">
				<button class="custom-select-button">Update Logo</button>
				<ul class="custom-select-list">
					<li id="upload-logo">Update Logo</li>
					<li id="remove-logo">Remove Logo</li>
				</ul>
			</div>
			<form enctype="multipart/form-data" data-remote="true">
				<input type="file" id="logo-file" name="file" accept="image/jpg,image/jpeg,image/gif"/>
			</form>
		</div>
		<div class="field-container">
			<label>Restaurant Name</label>
			<input type="text" id="name" value="{{employerProfile.name}}"/>
		</div>
		<div class="field-container address">
			<label>Street</label>
			<input type="text" id="street" value="{{employerProfile.location.address1}}"/>
			<input type="text" id="street2" value="{{employerProfile.location.address2}}"/>
		</div>
		<div class="field-container one-third">
			<label>City</label>
			<input type="text" id="city" value="{{employerProfile.location.city}}"/>
		</div>
		<div class="field-container small">
			<label>State</label>
			<div class="custom-select" data-index="0" data-value="1">
				<button id="state" class="custom-select-button">{{employerProfile.location.state}}</button>
				<ul class="custom-select-list">
					<li>AK</li>
					<li>AL</li>
					<li>AZ</li>
					<li>AR</li>
					<li>CA</li>
					<li>CO</li>
					<li>CT</li>
					<li>D.C.</li>
					<li>DE</li>
					<li>FL</li>
					<li>GE</li>
					<li>HI</li>
					<li>ID</li>
					<li>IL</li>
					<li>IN</li>
					<li>IO</li>
					<li>KN</li>
					<li>KY</li>
					<li>LA</li>
					<li>ME</li>
					<li>MD</li>
					<li>MA</li>
					<li>MI</li>
					<li>MN</li>
					<li>MS</li>
					<li>MO</li>
					<li>MT</li>
					<li>NE</li>
					<li>NV</li>
					<li>NH</li> 
					<li>NJ</li>
					<li>NM</li>
					<li>NY</li>
					<li>NC</li>
					<li>ND</li>
					<li>OH</li>
					<li>OK</li>
					<li>OR</li>
					<li>PA</li>
					<li>RI</li>
					<li>SC</li>
					<li>SD</li>
					<li>TN</li>
					<li>TX</li>
					<li>UT</li>
					<li>VT</li>
					<li>VA</li>
					<li>WA</li>
					<li>WV</li>
					<li>WI</li>
					<li>WY</li>
					<li>Unknown</li>
				</ul>
			</div>
		</div>
		<div class="field-container one-third zip">
			<label>Zip</label>
			<input type="text" id="zip" value="{{employerProfile.location.zip}}"/>
		</div>
		<div class="field-container one-third">
			<label>Phone</label>
			<input type="text" id="phone" value="{{employerProfile.phone}}"/>
		</div>
		<div class="field-container two-third">
			<label>Web URL</label>
			<input type="text" id="website" value="{{employerProfile.url}}"/>
		</div>
		<div class="field-container">
			<label>Price Per Person</label>
			<div id="ppa" class="custom-select" data-index="{{employerProfile.ppa}}" data-value="{{getEmployerPPA employerPPA employerProfile.ppa}}">
				<button class="custom-select-button">{{getEmployerPPA employerPPA employerProfile.ppa}}</button>
				<ul class="custom-select-list">
				{{#each employerPPA}}
					<li>{{this.label}}</li>
				{{/each}}
				</ul>
			</div>
		</div>
		{{#isNotNull employerProfile.about}}
			<div class="field-container about">
				<label>About</label>
				<textarea id="about" maxlength="512">{{employerProfile.about}}</textarea>
			</div>
		{{else}}
			<div id="add-about" class="foot">+ Add "About" Section</div>
		{{/isNotNull}}
	</div>
	{{#if_not_eq employerRating.rating undefined}}
		<div class="yelp-rating">
			<a href="{{employerRating.url}}" target="_blank">
				<img src="{{employerRating.ratingImgUrlSmall}}"/>
			</a>
		</div>
	{{/if_not_eq}}
</div>

<div class="profile-admins">
	<div class="settings-heading">Profile Admins</div>
	{{#each employerProfile.admins}}
		<div class="admin-container">
			<div class="picture">
				{{#hasPhoto user.photo}}
					<img src="{{user.photo}}"/>
				{{/hasPhoto}}
			</div>
			<div class="actions">
				<div class="name">{{user.firstname}} {{user.lastname}}</div>
				<div class="custom-select" data-index="0" data-value="Admin">
					<button class="custom-select-button">Admin</button>
					<ul class="custom-select-list">
						<li>Admin</li>
						<li id="{{id}}" data-guid="{{guid}}" data-user="{{user.guid}}" class="remove-admin">Remove</li>
					</ul>
				</div>
			</div>
		</div>
	{{/each}}
	<div id="add-admin-container" class="admin-container add">
		<div class="picture"></div>
		<div class="actions">
			<div class="email"><input type="email" id="admin-email" placeholder="Enter Email Address"/></div>
			<button id="make-admin">Make Admin</button>
		</div>
	</div>
	<div id="add-admin" class="foot">+ Add New Admin</div>
</div>