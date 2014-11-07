define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
		var PaymentConfig = Backbone.Model.extend({

			urlRoot : function(){
				return Utils.GetURL("/services/rest/payment/config");
			},

			url : function(){
				var url = this.urlRoot();
				return url;
			},

			initialize : function(){
				console.log("Payment config model initialized...");
			}

		});

		return PaymentConfig;
	}
);
