define([
		"backbone"
	],
	function(Backbone){
		var Language = Backbone.Model.extend({

			urlRoot : "/brushfire/services/rest/i18n/",
			language: "en",

			initialize : function(options){

				console.log("Language model initialized...");
				if(typeof options.language !== "undefined"){
					this.language = options.language;
				}

			},
			
			url : function(){
				var url = this.urlRoot + this.language;
				return url;
			}

		});

		return Language;
	}
);