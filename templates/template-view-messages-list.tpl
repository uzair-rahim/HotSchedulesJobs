{{#if_eq messageList.length 0}}
	<div class="empty-body">No Messages</div>
{{else}}
	<ul id="full-message-list" class="messages-list">
		{{#each messageList}}
		<li data-guid="{{this.guid}}" class="{{#if_eq this.latestMessage.employerSeen false}}new{{/if_eq}}">
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