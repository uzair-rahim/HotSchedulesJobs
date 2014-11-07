define([
		"jquery",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-job-row",
		"scripts/views/view-job-form"
	],
	function($, App, Utils, Marionette, Template, JobForm){
	"use strict";

	var ViewJobRow = Marionette.ItemView.extend({
		tagName : "li",
		className : "",
		template: Template,
		form: null,
		events : {
			"click"		: "editJob"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Job Row view initialized...");
		},

		onRender : function(){
			
		},

		editJob : function(event){
			if($(this.el).find(".job-information").length > 0){
				this.form.remove();
				$(this.el).removeClass("expanded");
			}else{
				var data = new Object();
				data.job = this.model.job;
				data.types = this.model.types;
				this.form = new JobForm({model : data});
				$(this.el).append(this.form.render().el);
				$(this.el).addClass("expanded");
			}
		},

		getWage : function(){
			return this.model.job.wage.toFixed(2);
		},

		getWageType : function(){
			var type = "";
			switch(this.model.job.wageType){
				case "HOURLY":
					type = "Hour"
				break;
				case "WEEKLY":
					type = "Week"
				break;
				case "BIWEEKLY":
					type = "Two Weeks"
				break;
				case "MONTHLY":
					type = "Month"
				break;
				case "ANNUALLY":
					type = "Year"
				break;
			}
			return type;
		},

		getCandidates : function(){
			return this.model.job.candidates.length;
		},

		hasCandidates : function(){
			return this.model.job.candidates.length > 0;
		},

		getReferralBonus : function(){
			var bonus = "No Referral Bonus";
			if(this.model.job.referralBonus !== null){
				bonus = "$" + this.model.job.referralBonus + ".00" ;
			}

			return bonus;
		},

		getPostedDate : function(){
			return "Posted: " + Utils.FormatDate(this.model.job.updated);
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.name = this.model.job.jobName;
				jsonObject.wage = "$" + this.getWage() + " / " + this.getWageType();
				jsonObject.candidates = this.getCandidates();
				jsonObject.hasCandidates = this.hasCandidates();
				jsonObject.bonus = this.getReferralBonus();
				jsonObject.posted = this.getPostedDate();
			return jsonObject;
		}
		
	});

	return ViewJobRow;
});