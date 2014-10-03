{{#if_eq haveChats true}}
	{{#isNotNull chat}}
		<div class="message-view-body">
			<ul class="chat-list">
				{{#each chat.messages}}
					<li class="date"><span>{{dateConverter created "month date"}}</span></li>
					<li>
						<div class="sender-picture">
							<div class="photo">
								{{#isNotNull sender.photo}}
									<img src="{{sender.photo.url}}"/>
								{{/isNotNull}}
							</div>
						</div>
						<div class="message">
							<div class="name">{{sender.firstname}} {{sender.lastname}}</div>
							<div class="time">{{dateConverter created "time"}}</div>
							<div class="text">{{chatMessageContent.text}}</div>
						</div>
					</li>
				{{/each}}
			</ul>
		</div>
		<div class="message-view-foot">
			<input type="text" id="new-full-reply-text" placeholder="Message...">
			<button class="primary" id="send-new-full-reply" disabled="true">Send</button>
		</div>
	{{else}}
		<p class="light">This blank message helps protect your privacy. Select a message from the list to view details</p>
	{{/isNotNull}}
{{else}}
	<p>This is where you can manage candidate conversations</p>
	<ul class="empty-message-info">
		<li>Messages can only be sent to candidates for specific jobs from the "Candidates" or "Jobs" page.</li>
		<li>Messages to candidates are visible to all other managers</li>
		<li>Only managers can compose messages to candidates.</li>
		<li>Once a candidate receives a message they can reply as many time as needed.</li>
	</ul>
{{/if_eq}}
