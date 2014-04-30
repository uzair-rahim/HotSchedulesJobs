define([
	"backbone"
	],
	function(Backbone){
		var Business = Backbone.Model.extend({
			url : "/brushfire/services/rest/employer",
			defaults : {
			},
			initialize : function(){
				console.log('Business model initialize...');
			}

		});

		return Business;
	}
);