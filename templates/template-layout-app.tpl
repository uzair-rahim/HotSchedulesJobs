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
<div id="app-alert-referral" class="app-alert referral-list">
	<div class="alert-title">Candidate's Referrals</div>
	<div class="alert-segmented-control">
		<div id="segmented-referrals" class="tab left">Referrals <span>(0)</span></div>
		<div id="segmented-pending" class="tab right unselected">Pending <span>(0)</span></div>
	</div>
	<div class="alert-body">
		<div id="referrals-segment">
			<ul class="referrals-list">
				There are pending requests.
			</ul>
		</div>
		<div id="pending-segment">
			<ul class="referrals-list">
				<li>
					<div class="empty">
						There are no pending requests.
					</div>
				</li>
			</ul>
		</div>
	</div>
	<div class="alert-action single">
		<button id="close-referral-list">Close</button>
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
		<p>We're happy to help. Email us at <a href="mailto:customercare@redbookconnect.com" id="customercare" tabIndex="-1">customercare@redbookconnect.com</a></p>
		<p>Or call us at <a href="tel:+1-877-720-8578" id="phone" tabIndex="-1">877-720-8578</a></p>
		<p>For additional information go to the <a href="https://hotschedulespost-redbookconnect.rightanswers.com/portal/public/" id="supportSite" tabIndex="-1">HotSchedules Support Site</a>.</p>
	</div>
</div>