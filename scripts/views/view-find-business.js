define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-find-business",
		"scripts/collections/collection-businesses",
		"scripts/models/model-business"
	],
	function($, Cookie, App, Utils, Marionette, Template, CollectionBusinesses, ModelBusiness){
	"use strict";

	var ViewFindBusiness = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #find"	: "find",
			"click #cancel"	: "cancel",
			"click .claim"	: "claimBusiness",
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Find Business view initialized...");
		},

		find : function(){
			console.log("Find business...");

			var that = this;


			$("input").removeClass("error");
			$("label").removeClass("bad");
			$("label[for=name]").text("Business Name");
			$("label[for=address]").text("Business Address");

			var vldtFind = vldt.validate({
				"#name" 	: "required",
				"#address"	: "required"
			});

			if(!vldtFind){
				var errors = vldt.getErrors();
				console.log(vldt.getErrors());

				for(var key in errors){
					if(errors[key] === false){
						$(key).addClass("error");
						switch(key){
							case "#name":
								$("label[for=name]").addClass("bad").text("Business Name is required");
							break;
							case "#address":
								$("label[for=address]").addClass("bad").text("Business Address is required");
							break;
						}
					}
				}

				return false;

			}else{

				var businessName = $("#name").val();
				var businessAddress = $("#address").val();
				var businesses = new CollectionBusinesses({name : businessName, address : businessAddress});

				businesses.fetch({
					headers : {
						"token" : Utils.GetUserSession().brushfireToken
					},
					success : function(response){
						that.model = response.models[0].attributes.businesses;
						that.render();
					},
					error : function(){
						Utils.ShowToast({message : "There was an error..."});
					}
				});

			}

		},

		claimBusiness : function(event){
			var business = $(event.target).next(".data-yelp");
			
			// Employer
			var businessObject   = new Object();
			businessObject.name  = $(business).find("input[name='name']").val();
			businessObject.phone = $(business).find("input[name='phone']").val();
			
			// Employer admin
			businessObject.admins = [ {user: {guid: Utils.GetUserSession().guid}} ];
			
			// Employer Location
			businessObject.location             = new Object();
			businessObject.location.address1	= $(business).find("input[name='address1']").val();
			businessObject.location.address2	= $(business).find("input[name='address2']").val();
			businessObject.location.city 		= $(business).find("input[name='city']").val();
			businessObject.location.state 	    = $(business).find("input[name='state']").val();
			businessObject.location.zip 		= $(business).find("input[name='zip']").val();
			businessObject.location.sourceId 	= $(business).find("input[name='id']").val();
			businessObject.location.country 	= $(business).find("input[name='country']").val();
			businessObject.externalIds			= [{"type" : 1, "externalId" : $(business).find("input[name='id']").val()}];
			
			var modelBusiness = new ModelBusiness();	
				modelBusiness.save(businessObject, {
					headers : {
						"token" : Utils.GetUserSession().brushfireToken
					},
					success : function(){
						console.log("Business successfully saved...");
						Utils.ShowToast({message : "Great success..."});
						App.router.navigate("logout", true);

					},
					error : function(){
						Utils.ShowToast({message : "There was an error..."});
					}
				});
		},

		cancel : function(){
			console.log("Cancel...");
			App.router.navigate("logout", true);
		},
		
		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.businesses = this.model;
				jsonObject.language = App.Language;

				console.log(jsonObject);
			return jsonObject;
		}
		
	});

	return ViewFindBusiness;
});