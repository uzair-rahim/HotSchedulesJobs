define([
		"jquery",
		"jquerycookie",
		"analytics",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-network",
		"scripts/models/model-user",
		"scripts/models/model-network",
		"scripts/collections/collection-followers",
		"scripts/collections/collection-endorsements"
	],
	function($, Cookie, Analytics, App, Utils, Marionette, Template, ModelUser, ModelNetwork, CollectionFollowers, CollectionEndorsers){
	"use strict";

	var ViewNetwork = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		employeesGuids : null,
		followersGuids : null,
		events : {
			"click #filter"					: "showFilter",
			"click #cancel-filter"			: "hideFilter",
			"click #search-filter"			: "searchFilter",
			"click #clear"					: "clearAllFilter",
			"click .user-dropdown button"	: "userActions",
			"click .view-profile"			: "profile",
			"click .candidate-select"		: "networkSelect",
			"click .chat-candidate"			: "networkChat",
			"click .candidate-message"		: "networkMessage",
			"click #send-chat"				: "sendBulkChat",
			"click .candidate-network"		: "networkConnections",
			"click .candidate-endorse"		: "networkEndorsements",
			"click #share-job"				: "shareJob",
			"click .connect-candidate"		: "createConnection",
			"click .disconnect-candidate"	: "deleteConnection",
			"click .grid-list-head"			: "expandCollapseSection"

		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Network view initialized...");

			// NEW selector
			$.expr[':'].Contains = function(a, i, m) {
			  return jQuery(a).text().toUpperCase()
			      .indexOf(m[3].toUpperCase()) >= 0;
			};

			// OVERWRITES old selector
			$.expr[':'].contains = function(a, i, m) {
			  return jQuery(a).text().toUpperCase()
			      .indexOf(m[3].toUpperCase()) >= 0;
			};			

			this.listenTo(App, "sendShareJob", this.sendShareJob);
		},

		onShow : function(){
			ga('create', 'UA-52257201-1', 'hotschedulespost.com');
      		ga('send', 'pageview', '/network');

			var jobs = this.model.jobsinfo;

			if(jobs.length > 0){
				var shareJobsButton = $("#select-share-job button");
				var shareJobsList = $("#select-share-job .custom-select-list");
				
				$(shareJobsButton).text(jobs[0].attributes.jobName);
				$(shareJobsList).html("");
				
				for(var i = 0; i < jobs.length; i++){
					$(shareJobsList).append("<li>"+jobs[i].attributes.jobName+"</li>");
				}
			}

			var loggedUserGUID = App.session.get("guid");
			var networkList = $(".grid-list");
			var that = this;

			$.each(networkList, function(){
				var network = $(this).find("li.view-profile");
				$.each(network, function(){
					var userGUID = $(this).attr("data-guid");
					if(userGUID == loggedUserGUID){
						var connectionItem = $(this).find(".connect-candidate");
						connectionItem.addClass("disabled");
					}else{
						var connection = that.isUserConnected(userGUID);
						if(connection !== null){
							var connectionItem = $(this).find(".connect-candidate");
								if(connection.state == "connected" || connection.state == "sent"){
									connectionItem.text("Disconnect");
									connectionItem.addClass("disconnect-candidate");
									connectionItem.removeClass("connect-candidate");
								}else{
									connectionItem.text("Accept Connection Request");
									connectionItem.addClass(connection.state);
								}
						}
					}
				});
			});

		},

		isUserConnected : function(userGUID){
			var connections = Utils.GetUserConnectionsList();
			var retval = null;
			$.each(connections, function(){
				if(userGUID == this.toUserGUID || userGUID == this.fromUserGUID){
					retval = this;
				}
			});

			return retval;
		},

		userActions : function(event){
			$(".custom-select-list").removeClass("show");
			$(".custom-select-list.user-dropdown").click(function(){
				$(".custom-select-list").removeClass("show");
			});

			var list = $(event.target).next();
			$(list).addClass("show");

			event.stopPropagation();
		},

		profile : function(event){

			var item = $(event.target).closest(".grid-list.top > li");
			var userGuid = $(item).attr("data-guid");
			var profile = $(item).find(".hourly-profile");
			var isProfileExpanded = $(profile).hasClass("show");
			var allProfiles = $(".hourly-profile");
			var allItems = $(".grid-list.top > li");

			$(allItems).removeClass("expanded");
			$(allItems).addClass("faded");
			$(allProfiles).removeClass("show");

			if(!isProfileExpanded){

				var user = new ModelUser();
				user.set({guid : userGuid});
				user.getWorkHistory(function(){
					var history = user.get("workHistory");
					var list = $(item).find(".hourly-profile .history-section .work-history");
					$(list).html("");
					
					if(history.length > 0){
						$.each(history, function(){
							var el = "<li>";
									el += "<div class='employer-logo'>"
										if(this.employer.logo !== null){
											el += "<img src='"+this.employer.logo.url+"'/>";
										}
									el += "</div>"	
									el += "<div class='employment-info'>"
										el += "<div class='employer-name'>"
											var total = this.jobs.length;
											$.each(this.jobs, function(index){
												el += this.jobName;
												if(index !== total-1){
													el += ", ";
												}
											});
										el += "</div>"
										el += "<div class='employment-position'>@"+ this.employer.name +"</div>"
										el += "<div class='employment-date'>"+ Utils.FormatDate(this.startDateMillis, "month/yyyy") + " - " + Utils.FormatDate(this.endDateMillis, "month/yyyy") +"</div>"
									el += "</div>"
								el += "</li>"
							$(list).append(el);
						});
					}else{
						$(list).remove();
						$(item).find(".hourly-profile .history-section").html("<label>Work History</label><div class='history'>Not Available</div>");
					}

					$(item).addClass("expanded");	
					$(item).removeClass("faded");	
					$(profile).addClass("show");
				});

			}else{
				$(item).removeClass("expanded");
				$(allItems).removeClass("faded");	
				$(allProfiles).removeClass("show");
			}

			ga('send', 'event', 'button', 'click', 'view network profile');
			event.stopPropagation();
		},

		networkSelect : function(event){
			var isChecked = $(event.target).prop("checked");

			if(isChecked){
				var userGUID = $(event.target).closest("li.view-profile").attr("data-guid");
				$('li.view-profile[data-guid="'+userGUID+'"]').find(".candidate-select:not(:checked)").prop("disabled", true);
			}

			var count = $(".candidate-select:checked").length;
			if(count > 0){
				$("#send-chat").prop("disabled",false);
				$("#share-job").prop("disabled",false);
			}else{
				this.disableToolbarButtons();
			}
			event.stopPropagation();
		},

		networkChat : function(event){
			ga("send", "event", "send-message-network", "click");
			var user = $(event.target).closest("li.view-profile");
			var userName = user.find(".candidate-info .candidate-name").text();
			var userGUID = user.attr("data-guid");

			var recipient = new Object();
				recipient.name = userName;
				recipient.guid = userGUID;

			var recipients = new Array();
				recipients.push(recipient);

			Utils.AddRecipientToNewMessage(recipients);
			Utils.ShowSendNewMessage();
			ga('send', 'event', 'button', 'click', 'send network message');
			event.stopPropagation();
		},

		networkMessage : function(event){
			var email = $(event.target).closest("li.view-profile").data("email");
			window.open("mailto:"+email);
			event.stopPropagation();
		},

		sendBulkChat : function(event){	
			ga("send", "event", "button", "click", "send bulk message to network");
			var candidates = $(".candidate-select:checked");
			var recipients = new Array();

			$.each(candidates, function(){
				var recipient = new Object();
					recipient.name = $(this).closest("li.view-profile").find(".candidate-info .candidate-name").text();
					recipient.guid = $(this).closest("li.view-profile").attr("data-guid");
				recipients.push(recipient);
			});

			Utils.AddRecipientToNewMessage(recipients);
			Utils.ShowSendNewMessage();
			this.disableToolbarButtons();
		},

		networkConnections : function(event){
			var user = $(event.target).closest(".view-profile");
			var guid1 = App.session.get("guid");
			var guid2 = $(user).attr("data-guid");	

			var network = new ModelNetwork();
				network.getSharedConnections(guid1, guid2, function(data){
					Utils.ShowSharedConnections(data);
				});

			ga('send', 'event', 'button', 'click', 'view network connections');
			event.stopPropagation();
		},

		networkEndorsements : function(event){
			var user = $(event.target).closest(".view-profile");
			var userGUID = $(user).attr("data-guid");

			var endorsements = new ModelUser();
				endorsements.getEndorsements(userGUID, function(data){
					Utils.ShowEndorsements(data);
				});

			ga('send', 'event', 'button', 'click', 'view network endorsements');
			event.stopPropagation();
		},

		showFilter : function(){
			var flyout = $("#filter-flyout");
			var isFlyoutVisible = $(flyout).hasClass("show");

			if(isFlyoutVisible){
				this.hideFilter();
			}else{
				$(flyout).addClass("show");
			}

		},

		hideFilter : function(){
			var flyout = $("#filter-flyout");
			$(flyout).removeClass("show");
		},

		searchFilter : function(){
			var flyout = $("#filter-flyout");
			var checkboxes = $(flyout).find(".filter-section input[type='checkbox']:checked");

			var employeesList = $("#employees-list");
			var followersList = $("#followers-list");

			var isCheckboxSelected = $(checkboxes).length > 0;

			if(!isCheckboxSelected){
				$(employeesList).find(".view-profile").show();
				$(followersList).find(".view-profile").show();
			}else{

				$(employeesList).find(".view-profile").hide();
				$(followersList).find(".view-profile").hide();

				$(checkboxes).each(function(){
					var jobname = $(this).next().text();
						$(employeesList).find(".candidate-job:Contains('"+jobname+"')").closest(".view-profile").show();
						$(followersList).find(".candidate-job:Contains('"+jobname+"')").closest(".view-profile").show();
				});

			}

			$(employeesList).prev().text("Current Employees ("+$(employeesList).find(".view-profile:visible").length+")");
			$(followersList).prev().text("People Following Your Business ("+$(followersList).find(".view-profile:visible").length+")");

			this.hideFilter();
		},

		clearAllFilter : function(){
			$(".filter-section .checkbox-group input").prop("checked", false);
		},

		shareJob : function(event){
			var userguids = [];
			var employeesGuids = [];
			var followersGuids = [];

			$(".candidate-select:checked").each(function(){
				var guid = $(this).closest("li.view-profile").data("guid");
				var list = $(this).closest("ul.grid-list");
				var network = $(list).attr("id");

				if(network === "followers-list"){
					followersGuids.push(guid);
				}else if(network === "employees-list"){
					employeesGuids.push(guid);
				}

			});

			this.employeesGuids = employeesGuids;
			this.followersGuids = followersGuids;

			var alert = $("#app-alert-share-job");
			$(alert).addClass("show");
			$(document).find("#app-modal").addClass("show");

			ga('send', 'event', 'button', 'click', 'share job with network');

		},

		sendShareJob : function(){
			var jobIndex = $("#select-share-job").attr("data-index");
			var jobGuid = this.model.jobsinfo[jobIndex].attributes.guid;
			var employeeGuids = this.employeesGuids;
			var followerGuids = this.followersGuids;

			var share = new Object();
				share.fromUser = new Object();
				share.jobPosting = new Object();
				share.employer = new Object();

				share.fromUser.guid = App.session.get("guid");
				share.employer.guid = App.session.getEmployerGUID();
				share.jobPosting.guid = jobGuid
				share.toEmployeeGuids = employeeGuids;
				share.toFollowerGuids = followerGuids;

				share.type = 1;

			var that = this;
			var restURL = Utils.GetURL("/services/rest/share");

			$.ajax({
				headers: { 
			        'Accept': 'application/json',
			        'Content-Type': 'application/json' 
			    },
				url : restURL,
				type : "POST",
				data: JSON.stringify(share),
	    		processData: false,
	    		success : function(){
	    			Utils.ShowToast({message : "Job Shared with your network"});
	    		},
	    		error : function(response){
	    			Utils.ShowToast({message : "Error sharing job"});
	    		}
			});

			this.disableToolbarButtons();
			var alert = $("#app-alert-share-job");
				$(alert).removeClass("show");
		},

		disableToolbarButtons : function(){
			$("#send-chat").prop("disabled", true);
			$("#share-job").prop("disabled", true);
			$(".candidate-select").prop("checked", false);
			$(".candidate-select").prop("disabled", false);
		},

		createConnection : function(event){
			var link = $(event.target);
			var isDisabled = link.hasClass("disabled");
			var isReceivedRequest = link.hasClass("received");
			var network = new ModelNetwork();

			if(isDisabled){
				event.stopPropagation();
				return;
			}
			
			if(isReceivedRequest){
				var userGUID = link.closest("li.view-profile").attr("data-guid");
				var connection = Utils.GetUserConnection(userGUID);
				var acceptThisConnection = new Object();
					acceptThisConnection.guid = connection.guid;
					acceptThisConnection.toUserGuid = connection.toUserGUID;
					acceptThisConnection.fromUserGuid = connection.fromUserGUID;

				var links = $("li.view-profile[data-guid='"+connection.fromUserGUID+"'] .connect-candidate");

				network.acceptConnection(acceptThisConnection, function(data){
					links.addClass("disconnect-candidate");
					links.removeClass("connect-candidate");
					links.removeClass("received");
					links.text("Disconnect");

					var newConnection = new Object();
						newConnection.guid = data.guid;
						newConnection.fromUserGUID = data.fromUserGuid;
						newConnection.toUserGUID = data.toUserGuid;
						newConnection.state = "connected";
					Utils.RemoveFromUserConnectionsList(connection);
					Utils.AddToUserConnectionsList(newConnection);
				});

				ga('send', 'event', 'button', 'click', 'accept connection request from network');
			}else{
				var connection = new Object();
					connection.fromUserGuid = App.session.get("guid");
					connection.toUserGuid = $(event.target).closest("li.view-profile").attr("data-guid");

				var links = $("li.view-profile[data-guid='"+connection.toUserGuid+"'] .connect-candidate");			

				network.createConnection(connection, function(data){
					links.addClass("disconnect-candidate");
					links.removeClass("connect-candidate");
					links.text("Disconnect");

					var newConnection = new Object();
						newConnection.guid = data.guid;
						newConnection.fromUserGUID = data.fromUserGuid;
						newConnection.toUserGUID = data.toUserGuid;
						newConnection.state = "sent";
					Utils.AddToUserConnectionsList(newConnection);
				});	

				ga('send', 'event', 'button', 'click', 'send connection request to network');
			}

			event.stopPropagation();
		},

		deleteConnection : function(event){
			var link = $(event.target);
			var userGUID = link.closest("li.view-profile").attr("data-guid");
			var connection = Utils.GetUserConnection(userGUID);

			
			var deleteThisConnection = new Object();
				deleteThisConnection.fromUserGuid = connection.fromUserGUID;
				deleteThisConnection.toUserGuid = connection.toUserGUID;

			var links = $("li.view-profile[data-guid='"+userGUID+"'] .disconnect-candidate");
			
			var network = new ModelNetwork();
				network.deleteConnection(deleteThisConnection, function(data){
					links.addClass("connect-candidate");
					links.removeClass("disconnect-candidate");
					links.text("Connect");
					Utils.RemoveFromUserConnectionsList(connection);
				});

			ga('send', 'event', 'button', 'click', 'delete connection from network');
			event.stopPropagation();
		},

		expandCollapseSection : function(event){
			var header = $(event.target);
			var id = $(header).attr("id");
			var section = $(header).parent();
			var isCollapsed = $(header).hasClass("collapsed");
			var hasData = $(section).find(".grid-list").html() !== "";

			if(isCollapsed){
				$(header).addClass("expanded");
				$(header).removeClass("collapsed");
				$(section).removeClass("collapsed");

				if(!hasData){
					switch(id){
						case "followers":
							this.getFollowers();
						break;
						case "endorsers":
							this.getEndorsers();
						break;
					}
				}

			}else{
				$(header).addClass("collapsed");
				$(header).removeClass("expanded");
				$(section).addClass("collapsed");
			}

			event.stopPropagation();
		},

		getFollowers : function(){
			var that = this;
			var employerGuid = App.session.getEmployerGUID();
			var followers = new CollectionFollowers({guid : employerGuid});

			followers.fetch({
				success : function(response){
					that.model.followers = response.models;
					that.render();
				}
			});
		},

		getEndorsers : function(){
			var that = this;
			var employerGuid = App.session.getEmployerGUID();
			var endorsers = new CollectionEndorsers({guid : employerGuid});

			endorsers.fetch({
				success : function(response){
					that.model.endorsements = response.models;
					that.render();
				}
			});
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
				jsonObject.breadcrumb = App.getTrail();
				jsonObject.jobtypes = this.model.jobtypes;
				jsonObject.employees = this.model.employees;
				jsonObject.followers = this.model.followers;
				jsonObject.endorsements = this.model.endorsements;
			return jsonObject;
		}
		
	});

	return ViewNetwork;
});