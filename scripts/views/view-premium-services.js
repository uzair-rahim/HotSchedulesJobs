define([
		"jquery",
		"jquerycookie",
		"analytics",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-premium-services"
	],
	function($, Cookie, Analytics, App, Utils, Marionette, Template){
	"use strict";

	var ViewPremium = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #premium-subscribe" : "premiumSubscribe"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Premium services view initialized...");
		},

		onShow : function(){
			ga('create', 'UA-52257201-1', 'hotschedulespost.com');
      		ga('send', 'pageview', '/premiumServices');
		},

		premiumSubscribe : function(){

		    var restUrl = Utils.GetURL("/services/rest/payment/plan/testMonthlyPlan/")
                                    + this.model.employerGuid + "/";
            var userEmail = this.model.userEmail;
            var imageUrl = Utils.GetURL("/images/icon175x175.jpeg");

            $.ajax({
                url: "https://checkout.stripe.com/checkout.js",
                dataType: "script",
                success : function() {
                    var handler = StripeCheckout.configure({
                        key: 'pk_test_8dg9x6425a8g5wJugEkMqYc7',
                        token: function(token) {
                            $.ajax({
                                url : restUrl + token.id,
                                type : "POST",
                                success : function() {
                                    Utils.ShowToast({message: "Subscription successful"});
                                },
                                error : function(response) {
                                    if (response.status === 400) {
                                        Utils.ShowToast({message: "We were unable to process your payment"});
                                    }
                                }
                            });
                        },
                        image: imageUrl,
                        email: userEmail,
                        opened: function() {
                            Utils.HideLoadingAnimation();
                        }
                    });

                    Utils.ShowLoadingAnimation();
                    handler.open({
                        name: 'HotSchedules POST',
                        description: 'Test Monthly Plan',
                        amount: 3199
                        });
                },
                error : function() {
                    Utils.ShowToast({message: "We were unable to contact our payment partner, please try again later"});
                }
            });
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.employer = this.model;
				jsonObject.language = App.Language;
				jsonObject.breadcrumb = App.getTrail();
			return jsonObject;
		}
		
	});

	return ViewPremium;
}
);