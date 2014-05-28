define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-support-nav",
		"scripts/models/model-delete-admin"
	],
	function($, Cookie, App, Utils, Marionette, Template, DeleteAdmin){
	"use strict";

	var ViewSupportNav = Marionette.ItemView.extend({
		tagName : "div",
		className : "navigation",
		template: Template,
		adminID : null,
		adminGUID : null,
		adminEmployer : null,
		events : {
			"click #settings"	: "settings",
			"click #logout"		: "logout"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Support Nav view initialized...");

			$(document.body).delegate(".grid-list.support li button.destroy", "click", this.removeAdmin);

			this.listenTo(App, "alertPrimaryAction", this.alertPrimaryAction);
			this.listenTo(App, "alertSecondaryAction", this.alertSecondaryAction);
		},

		alertPrimaryAction : function(){
			var listener = $("#app-alert").attr("data-listener");
			switch(listener){
				case "admin":
					this.completeRemoveAdmin();
				break;
			}
		},

		alertSecondaryAction : function(){
			var listener = $("#app-alert").attr("data-listener");
			switch(listener){
				case "admin":
					this.cancelRemoveAdmin();
				break;
			}
		},

		removeAdmin : function(event){
			var id = $(event.target).attr("id");
			var guid = $(event.target).attr("data-guid");
			var employer = $(event.target).attr("data-employer");
			this.adminID = id;
			this.adminGUID = guid;
			this.adminEmployer = employer;
			Utils.ShowAlert({listener : "admin", primary : true, primaryType : "destroy", primaryText : "Remove", title : "Remove Admin", message : "Are you sure you wan't to remove this admin?" });
		},

		completeRemoveAdmin : function(){
			Utils.HideAlert();

			var deleteAdmin = new DeleteAdmin({id : this.adminID, guid : this.adminEmployer, admin : this.adminGUID});

				deleteAdmin.destroy({
					dataType : "text",
					success : function(response){
						App.router.controller.support();
					},
					error : function(){
						console.log("Error removing admin...");
						Utils.ShowToast({ message : "Error removing admin..."});
					}
				});
		},

		cancelRemoveAdmin : function(){
			Utils.HideAlert();
		},

		settings : function(){
			var settings = $("#settings-flyout");
			var isVisible = $(settings).css("display") == "block"
			if(isVisible){
				$(settings).hide();
			}else{
				$(settings).show();
			}
		},

		logout : function(){
			App.router.navigate("logout", true);
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewSupportNav;
});