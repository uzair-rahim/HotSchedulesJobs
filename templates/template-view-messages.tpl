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
			<div class="message-search-container">
				<input type="text" placeholder="Search" id="search-messages-text"/>
			</div>
			<div class="message-info-container"></div>
		</div>
		<div class="message-body">
			<div class="message-list-container">
				{{#if_eq messageList.length 0}}
					<div class="empty-list">No Messages</div>
				{{else}}
					<ul id="full-message-list" class="messages-list">
						{{#each messageList}}
							{{#if_eq this.latestMessage.employerSeen true}}
								<li data-guid="{{this.guid}}">
							{{else}}
								<li class="new" data-guid="{{this.guid}}">
							{{/if_eq}}
								<div class="candidate-picture">
									{{#isNotNull this.candidate.photo}}
										<img src="{{this.candidate.photo.url}}"/>
									{{/isNotNull}}
								</div>
								<div class="candidate-info">
									<div class="candidate-profile">{{this.candidate.firstname}} {{this.candidate.lastname}}</div>
									<div class="candidate-message">{{this.latestMessage.chatMessageContent.text}}</div>
								</div>
							</li>
						{{/each}}
					<ul>
				{{/if_eq}}
			</div>
			<div class="message-view-container">
				{{#if_eq messageList.length 0}}
					<p>There is were you can manage candidates conversation</p>
					<ul class="empty-message-info">
						<li>Messages can only be sent to candidates for specific jobs from the "Candidates" or "Jobs" page.</li>
						<li>Messages to candidates are visible to all other managers</li>
						<li>Only managers can compose messages to candidates.</li>
						<li>Once a candidate received a message they can reply as many time as needed.</li>
					</ul>
				{{else}}
					<p class="light">This blank message helps protect your privacy, select a message from the list to view details</p>
				{{/if_eq}}
			</div>
		</div>
	</div>
</div>