define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-support",
		"scripts/collections/collection-support-search",
		"scripts/models/model-delete-admin"
	],
	function($, Cookie, App, Utils, Marionette, Template, CollectionSupportSearch, DeleteAdmin){
	"use strict";

	var ViewSupport = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		adminID : null, 
		adminEmployer : null, 
		adminGUID : null,
		employerID : null,
		employerGUID : null,
		template: Template,
		events : {
			"click #search-button"	: "search"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Support view initialized...");

			$(document.body).delegate(".grid-list.support li button.destroy.user", "click", this.removeUser);
			$(document.body).delegate(".grid-list.support li button.destroy.admin", "click", this.removeAdmin);
			$(document.body).delegate(".grid-list.support li button.destroy.employer", "click", this.removeEmployer);

			this.listenTo(App, "alertPrimaryAction", this.alertPrimaryAction);
			this.listenTo(App, "alertSecondaryAction", this.alertSecondaryAction);
		},

		onShow : function(){
			$("#search-field").keyup(function(event){
				if(event.keyCode == 13){
					$("#search-button").click();
				}
			});
		},

		search : function(){
			var searchTerm = $("#search-field").val();
			if(searchTerm !== ""){
				var searchType = $("#search-type").attr("data-index");
				switch(searchType){
					case "0":
						this.searchAdminsAndStores(searchTerm);
					break;
					case "1":
						this.searchUsers(searchTerm);
					break;
				}

			}
		},

		searchAdminsAndStores : function(searchTerm){
			var that = this;
			var search = new CollectionSupportSearch({string : searchTerm});
			search.fetch({
				success : function(response){
					var employersArray = new Array();
					var employersGUIDArray = new Array();
					var adminsArray = new Array();

					for(var i = 0; i<response.models.length; i++){
						var model = response.models[i].toJSON();
						var employer = model.employer;
						var employerGUID = employer.guid;

						adminsArray.push(model);

						var exist = $.inArray(employerGUID, employersGUIDArray);

						if(exist === -1){
							employersGUIDArray.push(employerGUID);
							employersArray.push(employer);
						}else{

						}

					}

					that.model = new Object();

					that.model.admins = new Object();
					that.model.employers = new Object();

					that.model.admins = adminsArray;
					that.model.employers = employersArray;

					that.render();
				},
				error : function(){
					console.log("Error fetching search results...");
					Utils.ShowToast({ message : "Error fetching search results..."});
				}
			});
		},

		searchUsers : function(searchTerm){
			var that = this;
			var restURL = Utils.GetURL("/services/rest/search/?types=2&searchString="+searchTerm);
			$.ajax({
				url : restURL,
				type : "GET",
				success : function(response){

					var usersArray = new Array();

					for(var i = 0; i<response.results.length; i++){
						var model = response.results[i].user;
						usersArray.push(model);
					}

					that.model = new Object();
					that.model.users = usersArray;

					that.render();

				},
				error : function(){
					console.log("Error fetching search results...");
					Utils.ShowToast({ message : "Error fetching search results..."});
				}
			});
		},

		alertPrimaryAction : function(){
			var listener = $("#app-alert").attr("data-listener");
			switch(listener){
				case "user":
					this.completeRemoveUser();
				break;
				case "admin":
					this.completeRemoveAdmin();
				break;
				case "employer":
					this.completeRemoveEmployer();
				break;
			}
		},

		alertSecondaryAction : function(){
			var listener = $("#app-alert").attr("data-listener");
			switch(listener){
				case "user":
					this.cancelRemoveUser();
				break;
				case "admin":
					this.cancelRemoveAdmin();
				break;
				case "employer":
					this.cancelRemoveEmployer();
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
						Utils.ShowToast({message : "Admin removed successfully"});
	    				setTimeout(function(){
							App.router.controller.support();
	    				},2000)
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

		removeEmployer : function(event){
			var id = $(event.target).attr("id");
			var guid = $(event.target).attr("data-guid");
			this.employerID = id;
			this.employerGUID = guid;
			Utils.ShowAlert({listener : "employer", primary : true, primaryType : "destroy", primaryText : "Remove", title : "Remove Employer", message : "Are you sure you wan't to remove this employer?" });
		},

		completeRemoveEmployer : function(){
			Utils.HideAlert();

			var that = this;
			var restURL = Utils.GetURL("/services/rest/employer/");

			$.ajax({
				url : restURL+that.employerGUID+"/unclaim",
				type : "POST",
				dataType: "text",
				contentType: false,
	    		processData: false,
	    		success : function(response){
	    			Utils.ShowToast({message : "Employer removed successfully"});
	    			setTimeout(function(){
						App.router.controller.support();
	    			},2000)
	    		},
	    		error : function(response){
	    			console.log(response);
	    			Utils.ShowToast({message : "Error removing employer"});
	    		}
			});
			
		},

		cancelRemoveEmployer : function(){
			Utils.HideAlert();
		},

		removeUser : function(event){
			var id = $(event.target).attr("id");
			var guid = $(event.target).attr("data-guid");
			this.userID = id;
			this.userGUID = guid;
			Utils.ShowAlert({listener : "user", primary : true, primaryType : "destroy", primaryText : "Deactivate", title : "Deactivate User", message : "Are you sure you want to deactivate this user?" });
		},

		completeRemoveUser : function(){
			Utils.HideAlert();

			var that = this;
			var restURL = Utils.GetURL("/services/rest/user");

			$.ajax({
				headers: { 
			        'Accept': 'application/json',
			        'Content-Type': 'application/json' 
			    },
				url : restURL,
				type : "PUT",
				data : JSON.stringify({ guid : that.userGUID, accountState : "deactivated"}),
				dataType: "text",
	    		processData: false,
	    		success : function(response){
	    			Utils.ShowToast({message : "User removed successfully"});
	    			setTimeout(function(){
						App.router.controller.support();
	    			},2000)
	    		},
	    		error : function(response){
	    			Utils.ShowToast({message : "Error removing user"});
	    		}
			});
		},

		cancelRemoveUser : function(){
			Utils.HideAlert();
		},
		
		serializeData : function(){
			var jsonObject = new Object();

				if(typeof this.model !== "undefined"){
					jsonObject.users = this.model.users;
					jsonObject.admins = this.model.admins;
					jsonObject.employers = this.model.employers;
				}

				jsonObject.language = App.Language;

			return jsonObject;
		}
		
	});

	return ViewSupport;
});