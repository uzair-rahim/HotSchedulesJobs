{{#if_eq haveChats false}}
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
