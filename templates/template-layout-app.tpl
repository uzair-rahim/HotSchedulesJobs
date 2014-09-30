<div id="app-modal"></div>
<div id="app-head"></div>
<div id="app-body"></div>
<div id="app-toast"></div>
<!--General Purpose Alert-->
<div id="app-alert" class="app-alert">
	<div class="alert-title">Alert Title</div>
	<div class="alert-message">Alert message goes here</div>
	<div class="alert-action">
		<button id="primary-action">OK</button>
		<button id="secondary-action">Cancel</button>
	</div>
</div>
<!--Terms and Conditions Alert-->
<div id="alert-terms-conditions" class="app-alert wide">
	<div class="alert-title">Terms and Conditions</div>
	<div class="alert-body">
		<div class="terms-and-conditions"></div>
	</div>
	<div class="alert-action">
		<button id="accept-terms" class="primary">Accept</button>
		<button id="decline-terms">Decline</button>
	</div>
</div>
<!--Copy Tiny URL Alert-->
<div id="app-alert-tinyurl" class="app-alert">
	<div class="alert-title">Copy Link</div>
	<div class="alert-message">Select the link below and copy it</div>
	<div class="alert-body">
		<input type="text" class="jobURL" value=""/>
	</div>
	<div class="alert-action single">
		<button id="close-copy-link">Close</button>
	</div>
</div>
<!--Candidate Referrals List Alert-->
<div id="app-alert-referrals" class="app-alert referral-list">
	<div class="alert-title">Referrals</div>
	<div class="alert-segmented-control">
		<div id="segmented-referrals" class="tab left">Referrals <span>(0)</span></div>
		<div id="segmented-pending" class="tab right unselected">Pending <span>(0)</span></div>
	</div>
	<div class="alert-body">
		<div id="referrals-segment">
			<ul class="referrals-list">
			</ul>
		</div>
		<div id="pending-segment">
			<ul class="referrals-list">
			</ul>
		</div>
	</div>
	<div class="alert-action single">
		<button id="close-referral-list">Close</button>
	</div>
</div>
<!--Candidate Connections List Alert-->
<div id="app-alert-shared-connections" class="app-alert shared-connections-list">
	<div class="alert-title">Shared Connections</div>
	<div class="alert-body">
		<div id="shared-connections-segment">
			<ul class="shared-connections-list">
			</ul>
		</div>
	</div>
	<div class="alert-action single">
		<button id="close-connections-list">Close</button>
	</div>
</div>
<!--User Endorsements List Alert-->
<div id="app-alert-endorsements" class="app-alert endorsements-list">
	<div class="alert-title">Endorsements</div>
	<div class="alert-body">
		<div id="endorsements-segment">
			<ul class="endorsements-list">
			</ul>
		</div>
	</div>
	<div class="alert-action single">
		<button id="close-endorsements-list">Close</button>
	</div>
</div>
<!--Resize logo on upload alert-->
<div id="app-alert-resize-logo" class="app-alert resize-logo">
	<div class="alert-title">Your Logo</div>
	<div class="alert-body">
		<div class="resize-logo-container">
			<div class="overlay"></div>
			<div class="background"></div>
		</div>
		<div class="resize-slider-container">
			<div class="icon small"></div>
			<div class="slider">
				<div class="handle"></div>
			</div>
			<div class="icon"></div>
		</div>
	</div>
	<div class="alert-action">
		<button id="save-logo" class="primary">Save</button>
		<button id="close-resize-logo">Close</button>
	</div>
</div>
<!--Share Job Alert-->
<div id="app-alert-share-job" class="app-alert share-job">
	<div class="alert-title">Share Job</div>
	<div class="alert-body">
		<p>Which jobs would you like to share?</p>
		<div id="select-share-job" class="custom-select share-job" data-index="0" data-value="">
			<button class="custom-select-button"></button>
			<ul class="custom-select-list"></ul>
		</div>
	</div>
	<div class="alert-action">
		<button id="send-share-job" class="primary">Share</button>
		<button id="close-share-job">Close</button>
	</div>
</div>
<!--Share Posted Job Alert-->
<div id="app-alert-share-posted-job" class="app-alert share-job">
	<div class="alert-title">Share This Job?</div>
	<div class="alert-body">
		<div class="field-container">
			<input type="checkbox" id="share-posted-connections"/>
			<label for="share-posted-connections">Connections</label>
		</div>
		<div class="field-container">
			<input type="checkbox" id="share-posted-current-employees"/>
			<label for="share-posted-current-employees">Employees</label>
		</div>
		<div class="field-container">
			<input type="checkbox" id="share-posted-followers"/>
			<label for="share-posted-followers">Followers</label>
		</div>
	</div>
	<div class="alert-action">
		<button id="send-share-posted-job" class="primary">Share</button>
		<button id="close-share-posted-job">Close</button>
	</div>
</div>
<!--Select Employer Alert-->
<div id="app-alert-select-employer" class="app-alert select-employer">
	<div class="alert-title">Select A Store</div>
	<div class="alert-body">
		<div id="select-employer" class="custom-select select-employer" data-index="0" data-value="">
			<button class="custom-select-button"></button>
			<ul class="custom-select-list"></ul>
		</div>
	</div>
	<div class="alert-action single">
		<button id="set-employer" class="primary">Go</button>
	</div>
</div>
<!--Compose Chat Alert-->
<div id="app-alert-new-message" class="app-alert new-message">
	<div class="alert-title">New Message</div>
	<div class="alert-body">
		<div class="pills-container">
			<label>To:</label>
		</div>
		<textarea id="new-message-text"></textarea>
	</div>
	<div class="alert-action">
		<button id="send-new-message" class="primary">Send</button>
		<button id="cancel-new-message">Cancel</button>
	</div>
</div>
<!-- Quick Message View -->
<div id="quick-message-view" class="dialog">
	<div class="mask">
		<div class="scrollable">
			<div class="inbox">
				<div class="dialog-head">Messages</div>
				<div class="dialog-body"></div>
				<div id="see-all-messages" class="dialog-foot">See All</div>
			</div>
			<div class="chat">
				<div id="back" class="dialog-head back">Messages</div>
				<div class="dialog-body short"></div>
				<div class="dialog-foot tall">
					<input type="text" id="new-reply-text" placeholder="Message..."/>
					<button class="primary" id="send-new-reply" disabled="true">Send</button>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- New Job Alert-->
<div id="app-alert-new-job-request" class="app-alert">
	<div class="alert-title">New Job Requests!</div>
	<div class="alert-body"></div>
	<div class="alert-action">
		<button id="create-new-job" class="primary">Create New Job</button>
		<button id="dismiss-new-job-request">Dismiss</button>
	</div>
</div>
<!--App Help -->
<div id="app-help" tabIndex="-1">
	<div class="header">
		<label>Get Help</label>
		<div id="close-help" class="btn-close"></div>
	</div>
	<div id="app-help-content">
		<h6>Need help?</h6>
		<p>HotSchedules Post makes it easy to create a restaurant profile and post a job. It's free, just <a href="index.jsp?#signup" tabIndex="-1">sign-up</a> and go</p>
		<h6>Want to find a job?</h6>
		<p>Simply download the HotSchedules Post FREE app, sign-up and go.</p>
		<div id="google-play" class="google-hspost-help"></div><div id="app-store" class="ios-hspost-help"></div>
		<h6>Have more questions?</h6>
		<p>We're happy to help. Email us at <a href="mailto:customercare@redbookconnect.com" id="customercare" tabIndex="-1" target="_blank">customercare@redbookconnect.com</a></p>
		<p>Or call us at <a href="tel:+1-877-720-8578" id="phone" tabIndex="-1">877-720-8578</a></p>
		<p>For additional information go to the <a href="https://hotschedulespost-redbookconnect.rightanswers.com/portal/public/" id="supportSite" tabIndex="-1" target="_blank">HotSchedules Support Site</a>.</p>
	</div>
</div>