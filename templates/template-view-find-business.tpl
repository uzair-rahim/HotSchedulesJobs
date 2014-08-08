<div class="rbc-logo"></div>
<div class="form-container wide">
	<div class="login-form">
		<div class="logo"></div>
		<p>Is your business already on HotSchedules Post? Search now. Or create a new page if we don't have it.</p>
		<input type="text" placeholder="Business Name" id="businessname"/>
		<input type="text" placeholder="Business Address" id="businessaddress"/>
		<button id="find">Find My Business</button>
		<a id="logout-link">Logout, I'll do it later</a>
		{{#if_not_eq businesses undefined}}
			<div class="search-result">
				<p>Search Results</p>
				<ul class="business-search-result">
					{{#if_gt businesses.length 0}}
						{{#each businesses}}
							<li>
								<div class="info">
									<div class="line1">{{this.name}}</div>
									<div class="line2">{{this.location.address.[0]}} {{this.location.city}}</div>
								</div>
								<div class="action">
									{{#if_eq this.brushfireClaimed true}}
										<a class="claimed">Claimed</a>
									{{else}}
										<button class="claim">Claim</button>
									{{/if_eq}}
									<div class="data-yelp">
										<input type="hidden" name="name" value="{{this.name}}"/>
										<input type="hidden" name="id" value="{{this.id}}"/>
										<input type="hidden" name="address1" value="{{this.location.address.[0]}}"/>
										<input type="hidden" name="address2" value="{{this.location.address.[1]}}"/>
										<input type="hidden" name="city" value="{{this.location.city}}"/>
										<input type="hidden" name="state" value="{{this.location.stateCode}}"/>
										<input type="hidden" name="zip" value="{{this.location.postalCode}}"/>
										<input type="hidden" name="country" value="{{this.location.countryCode}}"/>
										<input type="hidden" name="phone" value="{{this.phone}}"/>
									</div>
								</div>
							</li>
						{{/each}}
					{{else}}
						<li class="no-result">
							<div class="info">
								<div class="line1">Sorry, there were no matches</div>
								<div class="line2">Please try adjusting your search</div>
							</div>
						</li>
					{{/if_gt}}
				</ul>
			</div>
		{{/if_not_eq}}
	</div>
	<div id="help-icon" class="wide">?</div>
</div>