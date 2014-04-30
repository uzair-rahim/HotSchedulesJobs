<div id="sub-nav">
	<ul id="breadcrumb">
		{{#each breadcrumb}}
			<li>{{this}}</li>
		{{/each}}
	</ul>
</div>

<div id="toolbar">
	<button id="logout">Logout</button>
</div>



<style type="text/css">
	ul.pills{
		display: block;
		float: left;
		clear: both;
		margin: 18px 0;
	}
	ul.pills li{
		display: block;
		float: left;
		margin: 0 10px 0 0;
	}
	ul.pills li a{
		display: block;
		float: left;
		line-height: 24px;
		padding: 0 12px;
		color: #2d3c4b;
	}
	ul.pills li a.selected{
		color: #fcfeff;
		background-color: #2d3c4b;
		border-radius: 2px;
	}
	div.profile-cover{
		display: block;
		float: left;
		clear: both;
		width: calc(100% - 2px);
		margin: 0 0 10px 0;
		border :1px solid #e2e4e5;
		overflow: hidden;
	}
	div.profile-cover div.profile-map{
		display: block;
		float: left;
		clear: both;
		width: 100%;
		height: 164px;
		background-color: #f0f0f0;
	}
	div.profile-cover div.profile-info{
		display: block;
		float: left;
		clear: both;
		width: 100%;
		height: 84px;
		background-color: #ffffff;
		border-top :1px solid #e2e4e5;
	}
	div.profile-cover div.profile-info div.name{
		display: block;
		float: left;
		clear: both;
		margin: 20px 0 2px 15px;
		color: #2d3c4b;
		font-size: 22px;
		font-weight: bold;
		line-height: 24px;
	}
	div.profile-cover div.profile-info div.address{
		display: block;
		float: left;
		clear: both;
		margin: 0 0 0 15px;
		color: #959ba2;
		font-size: 16px;
		line-height: 18px;
	}
	div.editable-list-container{
		display: block;
		float: left;
		clear: both;
		width: 100%;
		margin: 10px 0 0 0;
	}
	div.editable-list-container > label{
		display: block;
		float: left;
		clear: both;
		color: #2d3c4b;
		font-size: 12px;
		line-height: 16px;
		font-weight: bold;
		text-transform: uppercase;
	}
	div.editable-list-container ul.editable-list{
		display: block;
		float: left;
		clear: both;
		width: 100%;
		margin: 10px 0;
	}
	div.editable-list-container ul.editable-list > li{
		display: block;
		float: left;
		clear: both;
		width: 100%;
		height: 100%;
		border-bottom:1px dotted #bfbfbf;
	}
	div.editable-list-container ul.editable-list > li:hover{
		background-color: #f9f9f9;
	}
	div.editable-list-container ul.editable-list > li label{
		display: block;
		float: left;
		width: 80px;
		margin: 0 0 0 2px;
		color: #626970;
		font-size: 12px;
		font-weight: bold;
		line-height: 30px;
	}
	div.editable-list-container ul.editable-list > li span{
		display: block;
		float: left;
		margin: 0 0 0 2px;
		color: #6d757b;
		font-size: 12px;
		line-height: 30px;
	}
	div.editable-list-container ul.editable-list > li span.empty{
		color: #b1b1b1;
		font-style: italic;
	}
	div.editable-list-container ul.editable-list > li div.edit-mode{
		display: none;
		float: left;	
	}
	div.editable-list-container ul.editable-list > li div.edit-mode input{
		display: block;
		float: left;
		clear: both;
		font-size: 12px;
		margin: 7px 0 5px 0;
		padding: 4px 6px;
	}
	div.editable-list-container ul.editable-list > li div.edit-mode button{
		display: block;
		float: left;
		margin: 2px 5px 7px 0;
		padding: 4px 10px;
	}
	div.editable-list-container ul.editable-list > li a{
		display: block;
		float: right;
		margin: 0 2px 0 0;
		font-size: 12px;
		color: #4ea6e5;
		line-height: 30px;
	}
	div.editable-list-container ul.editable-list > li:hover a,
	div.editable-list-container ul.editable-list > li a:hover{
		text-decoration: underline;
	}
	div.editable-list-container ul.editable-list > li ul{
		display: block;
		float: left;
		margin: 5px 0;
	}
	div.editable-list-container ul.editable-list > li ul li{
		display: block;
		float: left;
		clear: both;
		text-align: left;
		line-height: 20px;
		width: 140px;
	}
	div.editable-list-container ul.editable-list > li ul li span{
		display: inline;
		float: right;
		line-height: 20px;
	}

	@media screen and (max-width: 700px){
		#app-settings{
			overflow-y: auto;
		}
		#closeSettings{
			
		}
		#settings-menu{
			clear: both;
			width: 100%;
		}
		#settings-menu h1{
			width: 100%;
			margin:10px 0 0 10px;
		}
		#settings-menu .menu-section{
			margin: 25px 0 0 10px;
			width: calc(100% - 20px);
		}
		#settings-menu .menu-section ul li a{
			width: 100%;
		}
		#settings-menu .menu-section ul li span{
			width: 100%;
		}
		#settings-menu .menu-section button{
			
		}
		#settings-content{
			clear: both;
			width: 100%;	
		}
		#settings-head{
			margin-left: 10px;
		}
		#settings-body{
			margin-left: 10px;
		}

		div.profile-cover div.profile-map{
			height: auto;
		}

		div.profile-cover div.profile-map img{
			width: 100%;

		}

		.app-settings-body{
			height: auto;

		}
	}
	@media screen and (max-width: 500px){
		div.profile-cover div.profile-info{
			height: 70px;
		}

		div.profile-cover div.profile-info div.name,
		div.profile-cover div.profile-info div.address{
			width: 250px;
			font-size: 14px;
			line-height: 16px;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}

		div.editable-list-container ul.editable-list > li label{
			clear: both;
		}

		div.editable-list-container ul.editable-list > li span{
			clear: both;
			line-height: 16px;
		}

		div.editable-list-container ul.editable-list > li a{
			clear: both;
			line-height: 16px;
			margin:10px 0;
		}

		div.editable-list-container ul.editable-list > li div.edit-mode{
			clear: both;
		}

		div.editable-list-container ul.editable-list > li ul{
			clear: both;
			margin-left: 4px;
		}
	}
</style>



<div class="profile-container" style="width:calc(100% - 40px); margin: 20px;">
	<div class="profile-cover">
	<div class="profile-map">
		<img src="http://maps.googleapis.com/maps/api/staticmap?center={{employerProfileInfo employerProfile 'address' 'value'}}&zoom=13&size=600x200&maptype=roadmap&markers=color:red%7Clabel:C%7C{{employerProfileInfo employerProfile 'address' 'value'}}&sensor=false"/>
	</div>
	<div class="profile-info">
		<div class="name">{{employerProfileInfo employerProfile "name" "value"}}</div>
		<div class="address">{{employerProfileInfo employerProfile "address" "value"}}</div>
	</div>
</div>
<div class="editable-list-container">
	<label>Profile Info</label>
	<ul class="editable-list">
		<li class="editable">
			<label>Name</label>
			<span class='{{employerProfileInfo employerProfile "name"}}'>{{employerProfileInfo employerProfile "name" "value"}}</span>
		</li>
		<li class="editable">
			<label>Address</label>
			<span class='{{employerProfileInfo employerProfile "address"}}'>{{employerProfileInfo employerProfile "address" "value"}}</span>
		</li>
		<li>
			<label>Description</label>
			<span class='{{employerProfileInfo employerProfile "description"}}'>{{employerProfileInfo employerProfile "description" "value"}}</span>
		</li>
		<li class="editable">
			<label>Website</label>
			<span class='{{employerProfileInfo employerProfile "website"}}'>{{employerProfileInfo employerProfile "website" "value"}}</span>
		</li>
		<li class="editable">
			<label>Email</label>
			<span class='{{employerProfileInfo employerProfile "email"}}'>{{employerProfileInfo employerProfile "email" "value"}}</span>
		</li>
		<li class="editable">
			<label>Phone</label>
			<span class='{{employerProfileInfo employerProfile "phone"}}'>{{employerProfileInfo employerProfile "phone" "value"}}</span>
		</li>
		<li>
			<label>Hours</label>
			<ul>
				<li>Mon: <span>9:00AM to 9:00PM</span></li>
				<li>Tue: <span>9:00AM to 9:00PM</span></li>
				<li>Wed: <span>9:00AM to 9:00PM</span></li>
				<li>Thu: <span>9:00AM to 9:00PM</span></li>
				<li>Fri: <span>9:00AM to 9:00PM</span></li>
				<li>Sat: <span>9:00AM to 9:00PM</span></li>
				<li>Sun: <span>9:00AM to 9:00PM</span></li>
			</ul>
		</li>
	</ul>
</div>
</div>