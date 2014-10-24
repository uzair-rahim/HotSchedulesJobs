define([
		"jquery",
		"jquerycookie",
		"app",
		"backbone"
	],
	function($, Cookie, App, Backbone){
		var BrushfireUtils = Backbone.Model.extend({

			CONTEXT : CONTEXT_ROOT,
			recipientsGUIDS : [],
			jobPostingGUID : null,

			// Regular Expressions
			RegularExpressions : {
				alpha 			: /^[A-Za-z]/,
				alphanumeric 	: /^[A-Za-z0-9]/,
				date 			: /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/,
				email 			: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/,
				numeric 		: /^[0-9]+$/,
				phone 			: /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/,
				wholenumber 	: /^\d+$/,
				zip 			: /(^\d{5}$)|(^\d{5}-\d{4}$)/
			},

			// App Configurations
			AppConfig : {
				// Menu
				gettingStarted	: true,
				notification	: false,
				candidates		: true,
				jobs			: true,
				network			: true,
				messages		: true,
				settings		: true
			},

			// Get URL
			GetURL : function(url){
				//return this.CONTEXT + url;
				return "../services" + url;
			},

			// Get Default Route
			GetDefaultRoute : function(){
				if(this.AppConfig.dashboard){
					return "dashboard";
				}else{
					return 	"jobs";
				}
			},

			// Parse Query Parameters
			GetQueryParameters : function(queryString){
				if(typeof queryString == "undefined"){
					return false;
				}
				var query = queryString;
				var data = query.split("&");
				var result = {};
				for(var i=0; i<data.length; i++) {
					var item = data[i].split("=");
					result[item[0]] = item[1];
				}
				return result;
			},
			
			// Set Shared Connection Name
			SetSharedConnectionName : function(name){
				localStorage.setItem("BrushfireSharedConnectionName",name);
			},

			// Get Shared Connection Name
			GetSharedConnectionName : function(name){
				return localStorage.getItem("BrushfireSharedConnectionName");
			},

			// Remove Shared Connection Name
			RemoveSharedConnectionName : function(index){
				localStorage.removeItem("BrushfireSharedConnectionName");
			},

			// Set User Connections List
			SetUserConnectionsList : function(connections){
				localStorage.setItem("BrushfireUserConnectionsList", JSON.stringify(connections));
			},

			// Get User Connections List
			GetUserConnectionsList : function(){
				return JSON.parse(localStorage.getItem("BrushfireUserConnectionsList"));
			},

			GetUserConnection : function(userGUID){
				var connections = this.GetUserConnectionsList();
				var retval = null;
				$.each(connections,function(){
					if(userGUID == this.toUserGUID || userGUID == this.fromUserGUID){
						retval = this;
					}
				});

				return retval;
			},

			// Add to User Connections List
			AddToUserConnectionsList : function(connection){
				var connections = JSON.parse(localStorage.getItem("BrushfireUserConnectionsList"));
				var connectionsArray = new Array();
				$.each(connections, function(){
					connectionsArray.push(this);
				});
				connectionsArray.push(connection);
				localStorage.setItem("BrushfireUserConnectionsList", JSON.stringify(connectionsArray));
			},

			// Remove from User Connections List
			RemoveFromUserConnectionsList : function(connection){				
				var connections = JSON.parse(localStorage.getItem("BrushfireUserConnectionsList"));
					localStorage.removeItem("BrushfireUserConnectionsList");
				var connectionsArray = new Array();
				$.each(connections, function(){
					if(this.guid != connection.guid){
						connectionsArray.push(this);
					}
				});
				
				localStorage.setItem("BrushfireUserConnectionsList", JSON.stringify(connectionsArray));
			},

			// Remove User Connections List
			RemoveUserConnectionsList : function(){
				localStorage.removeItem("BrushfireUserConnectionsList");
			},

			// Check if support user
			IsSupportUser : function(roles){
				for(var i = 0; i < roles.length; i++){
					if(roles[i].role === "support"){
						return true;
					}
				}

				return false;
			},

			// Custom select
			InitCustomSelect : function(){
				console.log("Custom Select Initialized...");

				$(document.body).delegate(".custom-select button", "click", function(event){
					var list = $(event.target).next();
					var isVisibile = $(list).hasClass("show");

					var customSelect = $(".custom-select-list");
					$(customSelect).removeClass("show");

					if(isVisibile){
						$(list).removeClass("show");
					}else{
						$(list).addClass("show");
					}
				});

				$(document.body).delegate(".custom-select ul li", "click", function(event){
					var button = $(event.target).parent().parent().find("button");
					var select = $(event.target).parent().parent();
					var list = $(event.target).parent();
					var item = $(event.target);
					var index = $(item).index();
					var value = $(item).text();
					
					$(select).attr("data-index", index);
					$(select).attr("data-value", value);
					$(list).removeClass("show");
					$(button).text(value);

				});

				$(document.body).on("click", function(event){
					var element = $(event.target);
					var isCustomSelect = $(element).hasClass("custom-select-button");
					var customSelect = $(".custom-select-list");

					if(!isCustomSelect){
						$(customSelect).removeClass("show");	
					}
					
				});
			},

			// Toast
			ShowToast : function(options){
				var defaults = {
					portal : true,
					type : "",
					message : "There was an error"
				}

				var className = "show";

				if(typeof options === "undefined"){
					options = defaults;
				}else{
					for(var key in defaults){
						if(typeof(options[key]) === "undefined"){
							options[key] = defaults[key];
						}
					}
				}
				
				if(options.portal){
					className = "show-on-portal";
				}

				$(document).find("#app-toast").addClass(options.type).addClass(className).text(options.message);

				var remove = setTimeout(function(){
					$(document).find("#app-toast").removeClass(className).removeClass(options.type);
				}, 4000);
			},

			ShowAlert : function(options){
				defaults = {
					listener : "",
					primary : false,
					primaryType : "",
					secondaryType : "",
					primaryText : "OK",
					secondaryText : "Cancel",
					title : "Warning",
					message : "Are you sure?"
				}

				if(typeof options === "undefined"){
					options = defaults;
				}else{
					for(var key in defaults){
						if(typeof(options[key]) === "undefined"){
							options[key] = defaults[key];
						}
					}
				}

				var alert = $(document).find("#app-alert");

				$(alert).addClass("show");
				$(alert).attr("data-listener", options.listener);
				$(alert).find(".alert-title").text(options.title);
				$(alert).find(".alert-message").text(options.message);

				if(!options.primary){
					$(alert).find(".alert-action #primary-action").hide();
					$(alert).find(".alert-action").addClass("single");
				}else{
					$(alert).find(".alert-action #primary-action").show();
					$(alert).find(".alert-action #primary-action").text(options.primaryText).addClass(options.primaryType);
				}

				$(alert).find(".alert-action #secondary-action").text(options.secondaryText).addClass(options.secondaryType);

				$(document).find("#app-modal").addClass("show");
			},

			HideAlert : function(){
				$(document).find("#app-alert").removeClass("show");
				$(document).find("#app-alert .alert-action #primary-action").attr("class", " ");
				$(document).find("#app-alert .alert-action").removeClass("single");
				$(document).find("#app-modal").removeClass("show");
			},

			// Show loading animation
			ShowLoadingAnimation : function(){
				$(document).find("#app-modal").addClass("show");
			},

			// Hide loading animation
			HideLoadingAnimation : function(){
				$(document).find("#app-modal").removeClass("show");
			},

			InitMaxTextAreaLength : function(){
				var maxlengthAbout = 512;
				var maxlengthMessage = 1000;
				$(document.body).delegate("textarea:not('#new-message-text')", "keyup", function(){
					if ($(this).val().length > maxlengthAbout) {  
            			$(this).val($(this).val().substring(0, maxlengthAbout));
        			} 
				});

				$(document.body).delegate("textarea#new-message-text", "keyup", function(){
					if ($(this).val().length > maxlengthMessage) {  
            			$(this).val($(this).val().substring(0, maxlengthMessage));
        			} 
				});
			},

			// Reset Layout
			ResetLayout : function(){
				$(document).find("#app-modal").remove();
				$(document).find("#app-toast").remove();
				$(document).find("#app-alert").remove();

				$(document).find("#app-head").html("");
				$(document).find("#app-body .content").html("");

			},

			// Get Standalone Job GUID
			GetStandaloneJobGUID : function(){
				console.log("Getting Standalone Job GUID...");

				var url = window.location.href;
				var indexOfID = url.indexOf("?id=");

				if(indexOfID == -1){
					return false;
				}else{
					var id = url.substring(indexOfID+4); 
					var StandaloneJobGUID = id;
					if(StandaloneJobGUID !== undefined){
						return StandaloneJobGUID;
					}else{
						return false;
					}
				}
			},

			// Show Help Content
			ShowHelp : function(){
				var help = $("#app-help");
				var isVisible = $(help).hasClass("show")
				if(isVisible){
					$(help).removeClass("show");
				}else{
					$(help).addClass("show");
				}
			},

			// Hide Help Content
			HideHelp : function(){
				var help = $("#app-help");
				$(help).removeClass("show");
			},

			// Show Terms and Conditions
			ShowTermsAndConditions : function(options){

				var defaults = {
					inApp				: false,
					secondaryButtonText : "Decline" 
				}

				for(var key in defaults){
					if(typeof(options[key]) === "undefined"){
						options[key] = defaults[key];
					}
				}

				var alert = $("#alert-terms-conditions");
				$(alert).addClass("show");

				if(options.inApp){
					$("#accept-terms").hide();
					$("#decline-terms").text(options.secondaryButtonText);
					$(document).find("#alert-terms-conditions .alert-action").addClass("single");
				}

				$(document).find("#app-modal").addClass("show");
			},

			// Show Terms and Conditions
			HideTermsAndConditions : function(){
				var alert = $("#alert-terms-conditions");
				$(alert).removeClass("show");
				$("#accept-terms").show();
				$("#decline-terms").text("Decline");
				$(document).find("#alert-terms-conditions .alert-action").removeClass("single");
				$(document).find("#app-modal").removeClass("show");
			},

			// Links to Google Play and App Store
			GetStoreLinks : function(){
				var links = new Object();
					links.google = "https://play.google.com/store/apps/details?id=com.hotschedules.brushfire"
					links.apple = "https://itunes.apple.com/us/app/hotschedules/id888794188?mt=8"

				return links;
			},

			// Format Date
			FormatDate : function(given,type){
				var date = new Date(given);
				var defaultType = "mm/dd/yyyy";
				var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
				var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
				var	retval = "";
				
				if(typeof(type) === "undefined"){
					type = defaultType;
				}

				if(given === "Present" || given === 0){
					retval = "Present";
				}else{
					switch(type){
						case "mm/dd/yyyy":
							retval = (date.getUTCMonth())+"/"+date.getUTCDate()+"/"+date.getUTCFullYear();
						break;
						case "month/yyyy":
							retval = months[date.getUTCMonth()] + " " + date.getUTCFullYear();
						break;
						default:
							retval = (date.getUTCMonth())+"/"+date.getUTCDate()+"/"+date.getUTCFullYear();
						break;
					}	
				}
				
				return retval;
			},

			// Show Shared Connections
			ShowSharedConnections : function(connections){
				var list = $("ul.shared-connections-list");
					list.html("");

				if(connections.length === 0){
					list.append('<li><div class="empty">There are no shared connections</div></li>')
				}

				$.each(connections, function(){
					var candidate =  '<li>';
						candidate += '<div class="picture">';
						if(this.photo !== null){
							candidate += '<img src="'+this.photo.url+'"/>'
						}
						candidate += '</div>';
						candidate += '<div class="info">';
						candidate += '<div class="name">'+this.firstname+" "+this.lastname+'</div>';
						if(this.primaryWorkHistory !== null){
							candidate += '<div class="position">'+this.primaryWorkHistory.jobs[0].jobName+" @ "+this.primaryWorkHistory.employer.name+'</div>';	
						}else{
							candidate += '<div class="position">Not Available</div>';
						}
						candidate += '</div>';
						candidate += '<div class="send-message" data-email="'+this.email+'"></div>';
						candidate += '</li>';
						list.append(candidate);
				});

				var alertDialog = $(document).find("#app-alert-shared-connections");
				var app = $(document).find(".app");
					alertDialog.addClass("show");
					app.append('<div class="view-modal"></div>');
			},

			// Show Endorsements
			ShowEndorsements : function(endorsements){
				var list = $("ul.endorsements-list");
					list.html("");

				if(endorsements.length === 0){
					list.append('<li><div class="empty">There are no endorsements</div></li>')
				}

				$.each(endorsements, function(){
					var user =  '<li>';
						user += '<div class="picture">';
						if(this.photo !== null){
							user += '<img src="'+this.photo.url+'"/>'
						}
						user += '</div>';
						user += '<div class="info">';
						user += '<div class="name">'+this.firstname+" "+this.lastname+'</div>';
						if(this.primaryWorkHistory !== null){
							user += '<div class="position">'+this.primaryWorkHistory.jobs[0].jobName+" @ "+this.primaryWorkHistory.employer.name+'</div>';	
						}else{
							user += '<div class="position">Not Available</div>';
						}
						user += '</div>';
						user += '<div class="send-message" data-email="'+this.email+'"></div>';
						user += '</li>';
						list.append(user);
				});

				var alertDialog = $(document).find("#app-alert-endorsements");
				var app = $(document).find(".app");
					alertDialog.addClass("show");
					app.append('<div class="view-modal"></div>');
			},

			// Show Referrals
			ShowReferrals : function(referrals){
				var referralList = $("#referrals-segment ul.referrals-list");
				var pendingList = $("#pending-segment ul.referrals-list");
				var referralsCount = $("#segmented-referrals span");
				var pendingCount = $("#segmented-pending span");
				var totalReferrals = 0;
				var totalPending = 0;

				referralList.html("");
				pendingList.html("");

				$.each(referrals, function(){
					var referral =  '<li>';
						referral += '<div class="picture">';
						if(this.referringUser.photo !== null){
							referral += '<img src="'+this.referringUser.photo.url+'"/>'
						}
						referral += '</div>';
						referral += '<div class="info">';
						referral += '<div class="name">'+this.referringUser.firstname+" "+this.referringUser.lastname+'</div>';
						if(this.referringUser.primaryWorkHistory !== null){
							referral += '<div class="position">'+this.referringUser.primaryWorkHistory.jobs[0].jobName+" @ "+this.referringUser.primaryWorkHistory.employer.name+'</div>';	
						}else{
							referral += '<div class="position">Not Available</div>';
						}
						referral += '</div>';
						referral += '</li>';

						if(this.status === 1){
							totalReferrals++;
							referralList.append(referral);
						}else if(this.status === 0){
							totalPending++;
							pendingList.append(referral);
						}	
				});

				referralsCount.html(totalReferrals);
				pendingCount.html(totalPending);

				if(totalReferrals === 0){
					referralList.html('<li><div class="empty">There are no referrals</div></li>');
				}

				if(totalPending === 0){
					pendingList.html('<li><div class="empty">There are no pending referrals</div></li>');
				}

				var alertDialog = $(document).find("#app-alert-referrals");
				var app = $(document).find(".app");
					alertDialog.addClass("show");
					app.append('<div class="view-modal"></div>');
			},

			ShowSharePostedJobAlert : function(jobGUID){
				var alertDialog = $(document).find("#app-alert-share-posted-job");
					alertDialog.attr("data-job", jobGUID);
				var app = $(document).find(".app");
					alertDialog.addClass("show");
					app.append('<div class="view-modal"></div>');
			},

			ShowSendNewMessage : function(jobGUID){
				var alertDialog = $(document).find("#app-alert-new-message");
				var app = $(document).find(".app");
					alertDialog.addClass("show");
					app.append('<div class="view-modal"></div>');
			},

			HideSendNewMessage : function(jobGUID){
				var alertDialog = $(document).find("#app-alert-new-message");
					alertDialog.removeClass("show");
				$(document).find(".view-modal").remove();	
			},

			AddRecipientToNewMessage : function(recipients){
				var alertDialog = $(document).find("#app-alert-new-message");
				var recipientsContainer = alertDialog.find(".pills-container");
					recipientsContainer.find(".pill").remove();
				var that = this;	
				$.each(recipients, function(){
					var pill = '<div class="pill">';
						pill+= this.name;
						pill+= '</div>';
					recipientsContainer.append(pill);
					that.recipientsGUIDS.push(this.guid);
				});
			},

			RemoveRecipientFromNewMessage : function(index){
				this.recipientsGUIDS.splice(index,1);
			},

			RemoveAllRecipientFromNewMessage : function(){
				this.recipientsGUIDS = [];
			},

			GetNewMessageRecipients : function(){
				return this.recipientsGUIDS;
			},

			SetJobPostingGUID : function(guid){
				this.jobPostingGUID = guid;
			},

			GetJobPostingGUID : function(){
				return this.jobPostingGUID;
			},

			RemoveJobPostingGUID : function(){
				return this.null;
			},

			IsQuickMessageVisible : function(){
				var dialog = $(document).find("#quick-message-view");
				return dialog.hasClass("show");
			},

			ShowQuickMessage : function(){
				var dialog = $(document).find("#quick-message-view");
					dialog.addClass("show");
			},

			HideQuickMessage : function(){
				var dialog = $(document).find("#quick-message-view");
					dialog.find(".mask").animate({scrollLeft : dialog.width() * (-1)}, 10, function(){
						dialog.removeClass("show");	
					});
				var sendReplyButton = $(document).find("#send-new-reply");
					sendReplyButton.attr("data-guid", "");
					sendReplyButton.prop("disabled", true);
				var textField = $(document).find("#new-reply-text");
					textField.val("");
					
			},

			InitQuickMessageView : function(){
				$(document.body).on("click", function(event){
					var element = $(event.target);
					var isMessagesIcon = $(element).is("#messages");
					var isQuickViewDialog = $(element).closest("#quick-message-view").length == 1;
					
					if(!isMessagesIcon && !isQuickViewDialog){
						var dialog = $(document).find("#quick-message-view");
							dialog.find(".mask").animate({scrollLeft : dialog.width() * (-1)}, 10, function(){
								dialog.removeClass("show");	
							});
						var sendReplyButton = $(document).find("#send-new-reply");
							sendReplyButton.attr("data-guid", "");
							sendReplyButton.prop("disabled", true);
						var textField = $(document).find("#new-reply-text");
							textField.val("");	
					}
					
				});
			},

			GetChatListTemplate : function(data,type){
				var html = '';

				if(data.length == 0){
					if(type === "archived"){
						html = '<div class="empty-body">No Archived Messages</div>';
					}else{
						html = '<div class="empty-body">No Messages</div>';	
					}
				}else{
					html = '<ul id="quick-message-list" class="messages-list">';
					$.each(data,function(){
						if(this.latestMessage.employerSeen){
							html += '<li data-guid="'+this.guid+'">';
						}else{
							html += '<li class="new" data-guid="'+this.guid+'">';
						}
						html += '<div class="candidate-picture">';
							$.each(this.participants,function(){
								if(this.user !== null){
									if(this.user.photo !== null){
										html += '<img src="'+this.user.photo.url+'"/>';
									}
								}
							});
						html += '</div>';
						html += '<div class="candidate-info">';
							html += '<div class="candidate-profile">';
								$.each(this.participants,function(){
									if(this.user !== null){
										html += this.user.firstname + " " + this.user.lastname;
										if(this.user.primaryWorkHistory !== null){
											html += '<span>';
											html += "- " + this.user.primaryWorkHistory.jobs[0].jobName + " @ " + this.user.primaryWorkHistory.employer.name;
											html += '</span>';	
										}
									}
								});
							html += '</div>';
							html += '<div class="candidate-message">';
									html += this.latestMessage.chatMessageContent.text;
							html += '</div>';
							$.each(this.participants,function(){
								if(this.employer !== null){
									if(this.archived){
										html += '<div class="unarchive-message" data-guid="'+this.guid+'"></div>';	
									}else{
										html += '<div class="archive-message" data-guid="'+this.guid+'"></div>';	
									}
								}
							});
						html += '</div>';		
						html += '</li>';
					});
					html += '</ul>';
				}

				return html;
			},

			GetChatViewTemplate : function(data){
				var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
				var html = '<ul class="chat-list">';
					$.each(data.messages,function(){
						var date = new Date(this.created);
						var msgDate = months[date.getUTCMonth()] + " " + date.getUTCDate();
						var hours = date.getHours();
						var minutes = date.getMinutes();
						var ampm = hours >= 12 ? 'pm' : 'am';
						hours = hours % 12;
						hours = hours ? hours : 12;
						minutes = minutes < 10 ? '0'+minutes : minutes;
						html += '<li class="date"><span>'+msgDate+'</span></li>';
						if(this.employerSeen){
							html += '<li>';
						}else{
							html += '<li class="new">';
						}
							html += '<div class="sender-picture">';
								if(this.sender.photo == null){
									html += '<div class="photo"></div>';
								}else{
									html += '<div class="photo"><img src="'+this.sender.photo.url+'"/></div>';
								}
							html += '</div>';
							html += '<div class="message">';
								html += '<div class="name">'+this.sender.firstname+" "+this.sender.lastname+'</div>';
								html += '<div class="time">'+hours+":"+minutes+ampm+'</div>';
								html += '<div class="text">'+this.chatMessageContent.text+'</div>';
							html += '<div>';	
						html += '</li>';
					});
					html += '</ul>';
				return html;
			},

			GetChatMessageTemplate : function(data){
				var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
				var html = '';
				var date = new Date(data.created);
				var msgDate = months[date.getUTCMonth()] + " " + date.getUTCDate();
				var hours = date.getHours();
				var minutes = date.getMinutes();
				var ampm = hours >= 12 ? 'pm' : 'am';
				hours = hours % 12;
				hours = hours ? hours : 12;
				minutes = minutes < 10 ? '0'+minutes : minutes;
					html += '<li class="date"><span>'+msgDate+'</span></li>';
					html += '<li>';
						html += '<div class="sender-picture">';
						if(data.sender.photo == null){
							html += '<div class="photo"></div>';
						}else{
							html += '<div class="photo"><img src="'+data.sender.photo.url+'"/></div>';
						}
						html += '</div>';
						html += '<div class="message">';
							html += '<div class="name">'+data.sender.firstname+" "+data.sender.lastname+'</div>';
							html += '<div class="time">'+hours+":"+minutes+ampm+'</div>';
							html += '<div class="text">'+data.chatMessageContent.text+'</div>';
						html += '<div>';	
					html += '</li>';
				return html;
			},

			ShowNewJobRequestDialog : function(data){
				var app = $(document).find(".app");
				var alertDialog = $(document).find("#app-alert-new-job-request");
				var template = "";

				$.each(data, function(){
					var plural = " was";
					if(this.count > 1){
						plural = "s were";
					}
					template += '<div class="requested-job"><strong>' + this.count + ' ' + this.type + '</strong> job'+plural+' requested from you.</div>';
				});

				alertDialog.find(".alert-body").html(template);
				alertDialog.addClass("show");
				app.append('<div class="view-modal"></div>');
				
			}
			
		});

		var brushfireUtils = new BrushfireUtils();

		return brushfireUtils;
	}
);