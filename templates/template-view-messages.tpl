<div id="sub-nav">
	<ul id="breadcrumb">
		{{#each breadcrumb}}
			<li>{{this}}</li>
		{{/each}}
	</ul>
</div>
<div id="full-message-view" class="message-container">
	<div class="scrollable">
		<div class="message-head">
			<div class="message-folder-container">
				<div class="segmented-control">
					<div id="inbox-messages" class="tab left">Inbox</div>
					<div id="archived-messages" class="tab right unselected">Archived</div>
				</div>
			</div>
			<div class="message-info-container"></div>
		</div>
		<div class="message-body">
			<div class="message-list-container">
				<div class="message-search-container">
					<input type="text" placeholder="Search" id="search-messages-text"/>
				</div>
			</div>
		</div>
	</div>
</div>