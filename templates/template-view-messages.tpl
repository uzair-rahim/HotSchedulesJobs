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
				<div class="messages-list">
					{{#if_eq messageList.length 0}}
					<div class="empty-body">No Messages</div>
					{{else}}
						<ul id="full-message-list" class="messages-list">
							{{#each messageList}}
								{{#if_eq this.latestMessage.employerSeen true}}
									<li data-guid="{{this.guid}}">
								{{else}}
									<li class="new" data-guid="{{this.guid}}">
								{{/if_eq}}
									<div class="candidate-picture">
										{{#each this.participants}}
											{{#isNotNull this.user}}
												{{#isNotNull this.user.photo}}
													<img src="{{this.user.photo.url}}"/>
												{{/isNotNull}}	
											{{/isNotNull}}
										{{/each}}
									</div>
									<div class="candidate-info">
										{{#each this.participants}}
											{{#isNotNull this.user}}
												<div class="candidate-profile">{{this.user.firstname}} {{this.user.lastname}} <span>{{this.user.primaryWorkHistory.jobs.[0].jobName}} @ {{this.user.primaryWorkHistory.employer.name}}</span></div>			
											{{/isNotNull}}
										{{/each}}									
										<div class="candidate-message">{{this.latestMessage.chatMessageContent.text}}</div>
										{{#each this.participants}}
											{{#isNotNull this.employer}}
												{{#if_eq archived true}}
													<div class="unarchive-message" data-guid="{{this.guid}}"></div>
												{{else}}
													<div class="archive-message" data-guid="{{this.guid}}"></div>
												{{/if_eq}}
											{{/isNotNull}}
										{{/each}}									
									</div>
								</li>
							{{/each}}
						<ul>
					{{/if_eq}}
				</div>
			</div>
			<div class="message-view-container">
				{{#if_eq messageList.length 0}}
					<p>This is where you can manage candidate conversations</p>
					<ul class="empty-message-info">
						<li>Messages can only be sent to candidates for specific jobs from the "Candidates" or "Jobs" page.</li>
						<li>Messages to candidates are visible to all other managers</li>
						<li>Only managers can compose messages to candidates.</li>
						<li>Once a candidate receives a message they can reply as many time as needed.</li>
					</ul>
				{{else}}
					<p class="light">This blank message helps protect your privacy. Select a message from the list to view details</p>
				{{/if_eq}}
			</div>
		</div>
	</div>
</div>