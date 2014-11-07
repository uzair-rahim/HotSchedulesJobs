<div class="details">
	<div class="input-container position">
		<label>Position</label>
		<div class="custom-select job-position" data-index="0" data-value="{{job.jobName}}">
			<button class="custom-select-button">{{job.jobName}}</button>
			<ul class="custom-select-list">
				{{#each types}}
					<li id="{{guid}}">{{name}}</li>
				{{/each}}
			</ul>
		</div>
	</div>
	<div class="input-container">
		<label>Wage</label>
		<div class="dollar">$</div>
		<input type="text" class="wage" value="{{job.wage}}"/>
	</div>
	<div class="input-container">
		<label>Frequency</label>
		<div class="custom-select wage-type" data-index="0" data-value="{{job.wageType}}">
			<button class="custom-select-button">{{job.wageType}}</button>
			<ul class="custom-select-list">
				<li>Hourly</li>
				<li>Weekly</li>
				<li>Biweekly</li>
				<li>Monthly</li>
				<li>Annually</li>
			</ul>
		</div>
	</div>
	<div class="input-container description">
		<label>Description</label>
		<textarea class="job-description">{{job.description}}</textarea>
	</div>
	<div class="input-container referral-bonus">
		<label>Referral Bonus</label>
		<div class="dollar">$</div>
		<input type="text" class="bonus" value="{{job.referralBonus}}"/>
	</div>
</div>
<div class="actions">
	<button class="primary save">Save</button>
	<button class="cancel">Cancel</button>
</div>