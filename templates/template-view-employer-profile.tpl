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
				{{#hasPhoto employerProfile.logoURL}}
					<img id="logo" src="{{employerProfile.logoURL}}"/>
				{{/hasPhoto}}
			</div>
			<div id="logo-action" class="custom-select" data-index="0" data-value="0">
				<button class="custom-select-button">Update Logo</button>
				<ul class="custom-select-list">
					<li id="upload-logo">Update Logo</li>
					<li id="remove-logo">Remove Logo</li>
				</ul>
			</div>
			<input type="file" id="logo-file" accept="image/jpg,image/jpeg,image/gif"/>
		</div>
		<div class="field-container">
			<label>Restaurant Name</label>
			<input type="text" id="name" value="{{employerProfile.name}}"/>
		</div>
		<div class="field-container">
			<label>Street</label>
			<input type="text" id="street" value="{{employerProfile.location.address1}}"/>
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
			<div class="custom-select" data-index="0" data-value="1">
				<button class="custom-select-button">$$ ($11-$30)</button>
				<ul class="custom-select-list">
					<li>$ (Under $10)</li>
					<li>$$ ($11-$30)</li>
					<li>$$$ ($31-$60)</li>
					<li>$$$$ (Over $60)</li>
				</ul>
			</div>
		</div>
		<div class="foot">+ Add "About" Section</div>
	</div>
</div>

<div class="profile-admins">
	<div class="settings-heading">Profile Admins</div>
	{{#each employerProfile.admins}}
		<div class="admin-container">
			<div class="picture"></div>
			<div class="actions">
				<div class="name">{{user.firstname}} {{user.lastname}}</div>
				<div class="custom-select" data-index="0" data-value="Admin">
					<button class="custom-select-button">Admin</button>
					<ul class="custom-select-list">
						<li>Admin</li>
						<li>Remove</li>
					</ul>
				</div>
			</div>
		</div>
	{{/each}}
	<div class="foot">+ Add New Admin</div>
</div>