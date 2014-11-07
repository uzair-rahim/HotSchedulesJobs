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

            if (this.model.offers.length < 1) {
                return;
            }

            var offer = this.model.offers[0];
            var restUrl = Utils.GetURL("/services/rest/payment/plan/")
		                            + offer.id + "/"
                                    + this.model.employerGuid + "/";
            var userEmail = this.model.userEmail;
            var imageUrl = Utils.GetURL("/images/icon175x175.jpeg");
            var publicKey = this.model.publicKey;


            $.ajax({
                url: "https://checkout.stripe.com/checkout.js",
                dataType: "script",
                success : function() {
                    var handler = StripeCheckout.configure({
                        key: publicKey,
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
                        closed: function() {
                            Utils.HideLoadingAnimation();
                        }
                    });

                    Utils.ShowLoadingAnimation();
                    handler.open({
                        name: 'HotSchedules POST',
                        description: offer.shortName,
                        amount: offer.amount
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