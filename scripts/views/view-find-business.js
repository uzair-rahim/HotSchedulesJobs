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
			"click #find"		: "find",
			"click #cancel"		: "cancel",
			"click #logout-link": "logout",
			"click .claim"		: "claimBusiness",
			"click .claimed"	: "alreadyClaimed",
			"click #help-icon"	: "showHelp"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Find Business view initialized...");
			this.listenTo(App, "alertPrimaryAction", this.alertPrimaryAction);
			this.listenTo(App, "alertSecondaryAction", this.alertSecondaryAction);
		},

		onRender : function(){
			$(document).find(".rbc-logo").remove();
		},

		alertPrimaryAction : function(){
			//var listener = $("#app-alert").attr("data-listener");
			//switch(listener){
			//	case "claimed":
			//		this.closeClaimedDialog();
			//	break;
			//}
		},

		alertSecondaryAction : function(){
			var listener = $("#app-alert").attr("data-listener");
			switch(listener){
				case "claimed":
					this.closeClaimedDialog();
				break;
			}
		},

		find : function(){
			console.log("Find business...");

			var that = this;


			$("input").removeClass("error");
			$("label").removeClass("bad");
			$("label[for=businessname]").text("Business Name");
			$("label[for=businessaddress]").text("Business Address");

			var vldtFind = vldt.validate({
				"#businessname" 	: "required",
				"#businessaddress"	: "required"
			});

			if(!vldtFind){
				var errors = vldt.getErrors();
				console.log(vldt.getErrors());

				for(var key in errors){
					if(errors[key] === false){
						$(key).addClass("error");
						switch(key){
							case "#businessname":
								Utils.ShowToast({message : "Business name is required"});
							break;
							case "#businessaddress":
								Utils.ShowToast({message : "Business address is required"});
							break;
						}
					}
				}

				return false;

			}else{

				var businessName = $("#businessname").val();
				var businessAddress = $("#businessaddress").val();
				var businesses = new CollectionBusinesses({name : businessName, address : businessAddress});

				businesses.fetch({
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
			businessObject.currency				= new Object();
			businessObject.currency.currencyCode			= "USD";
			// Hardwired type 2 corresponds to EmployerIDType.YELP
			businessObject.externalIds			= [{"type" : 2, "externalId" : $(business).find("input[name='id']").val()}];
			
			var modelBusiness = new ModelBusiness();	
				modelBusiness.save(businessObject, {
					success : function(response){
						console.log("Business successfully saved...");

						Utils.DeleteUserSession();
						
						var user = new Object();
							user.guid = response.attributes.admins[0].user.guid;
							user.firstname = response.attributes.admins[0].user.firstname;
							user.lastname = response.attributes.admins[0].user.lastname;
							user.email = response.attributes.admins[0].user.emails[0].email;
							user.employerIds = new Array();	
							user.employerIds[0] = response.attributes.guid;
							user.verified = true;

							if(response.attributes.admins[0].user.roles.length > 0){
								user.role = response.attributes.admins[0].user.roles[0].role;
							}else{
								user.role = "employerAdmin";
							}

						Utils.CreateUserSession(user);
						Utils.ShowToast({message : "Welcome to HotSchedules Post"});
						App.router.navigate("jobs", true);

					},
					error : function(){
						Utils.ShowToast({message : "There was an error..."});
					}
				});
		},

		alreadyClaimed : function(){
			Utils.ShowAlert({ listener : "claimed", title : "Already Claimed", message : "This business has already been claimed", primary : false, secondaryText : "Ok" });
		},

		closeClaimedDialog : function(){
			Utils.HideAlert();
		},

		showHelp : function(){
			Utils.ShowHelp();
		},

		logout : function(){
			App.router.navigate("logout", true);
		},
		
		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.businesses = this.model;
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewFindBusiness;
});