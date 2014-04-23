define([
		"backbone",
		"utils"
	],
	function(Backbone, Utils){
		var Language = Backbone.Model.extend({

			language: "en",

			urlRoot : function(){
				return Utils.GetURL("/services/rest/i18n/");
			},

			initialize : function(options){

				console.log("Language model initialized...");
				if(typeof options.language !== "undefined"){
					this.language = options.language;
				}

			},
			
			url : function(){
				var url = this.urlRoot() + this.language;
				return url;
			}

		});

		return Language;
	}
);