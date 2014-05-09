<div id="sub-nav">
	<ul id="breadcrumb">
		{{#each breadcrumb}}
			<li>{{this}}</li>
		{{/each}}
	</ul>
	<ul id="page-actions">
		<li id="filter"></li>
	</ul>
</div>

<div id="toolbar">
	<button id="send-message" class="primary">Send Message</button>
</div>

<div id="filter-flyout" class="flyout">
	<h1>Filter Network</h1>
	<a id="clear" class="clear-all">Clear All</a>
	<div class="filter-section">
		<label>Position</label>
		<ul class="checkbox-group">
			{{#each jobtypes}}
				<li>
					<input id="{{guid}}" type="checkbox"/>
					<label for="{{guid}}">{{name}}</label>
				</li>
			{{/each}}
		</ul>
	</div>
	<div class="filter-section">
		<ul class="checkbox-group" style="margin-top:6px;">
			<li>
				<input id="archived-candidates" type="checkbox"/>
				<label for="archived-candidates">Current Employees</label>		
			</li>
			<li>
				<input id="archived-candidates" type="checkbox"/>
				<label for="archived-candidates">People Following Your Business</label>		
			</li>
		</ul>
	</div>
	<div class="button-group">
		<button id="search-filter" class="primary">Search</button>
		<a id="cancel-filter">Cancel</a>
	</div>
</div>

<div class="grid-list-head">Current Employees (2)</div>
<ul id="candidates-list" class="grid-list">
	<li class="view-profile">
		<input class="candidate-select" type="checkbox"/>
		<div class="candidate-picture">
			<img src="images/profiles/Christi.jpg"/>
		</div>
		<div class="candidate-info">
			<div class="candidate-name new">Brittney Smith</div>
			<div class="candidate-job">Cook @ Roaring Fork</div>
		</div>
		<div class="candidate-message"></div>
		<div class="candidate-endorse">0</div>
		<div class="candidate-network"><span>0</span> / 0</div>
	</li>

	<li class="view-profile">
		<input class="candidate-select" type="checkbox"/>
		<div class="candidate-picture">
			<img src="images/profiles/Ray.jpg"/>
		</div>
		<div class="candidate-info">
			<div class="candidate-name new">Christopher Nolan</div>
			<div class="candidate-job">Cook @ CPK</div>
		</div>
		<div class="candidate-message"></div>
		<div class="candidate-endorse">0</div>
		<div class="candidate-network"><span>0</span> / 0</div>
	</li>
</ul>


<div class="grid-list-head">People Following Your Business (3)</div>
<ul id="candidates-list" class="grid-list">
	<li class="view-profile">
		<input class="candidate-select" type="checkbox"/>
		<div class="candidate-picture">
			<img src="images/profiles/Christi.jpg"/>
		</div>
		<div class="candidate-info">
			<div class="candidate-name new">Brittney Smith</div>
			<div class="candidate-job">Cook @ Roaring Fork</div>
		</div>
		<div class="candidate-message"></div>
		<div class="candidate-endorse">0</div>
		<div class="candidate-network"><span>0</span> / 0</div>
	</li>

	<li class="view-profile">
		<input class="candidate-select" type="checkbox"/>
		<div class="candidate-picture">
			<img src="images/profiles/Michael.jpg"/>
		</div>
		<div class="candidate-info">
			<div class="candidate-name new">Ben Scott</div>
			<div class="candidate-job">Cook @ Roaring Fork</div>
		</div>
		<div class="candidate-message"></div>
		<div class="candidate-endorse">0</div>
		<div class="candidate-network"><span>0</span> / 0</div>
	</li>

	<li class="view-profile">
		<input class="candidate-select" type="checkbox"/>
		<div class="candidate-picture">
			<img src="images/profiles/Ray.jpg"/>
		</div>
		<div class="candidate-info">
			<div class="candidate-name new">Christopher Nolan</div>
			<div class="candidate-job">Cook @ CPK</div>
		</div>
		<div class="candidate-message"></div>
		<div class="candidate-endorse">0</div>
		<div class="candidate-network"><span>0</span> / 0</div>
	</li>
</ul>