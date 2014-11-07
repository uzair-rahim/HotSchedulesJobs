define([
		"jquery",
		"jquerycookie",
		"analytics",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-settings"
	],
	function($, Cookie, Analytics, App, Utils, Marionette, Template){
	"use strict";

	var ViewSettings = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #upload-picture"	: "uploadPicture",
			"click #remove-picture"	: "removePicture",
			"change #picture-file"	: "resizePicture",
			"click #save-settings" 	: "saveSettings"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Settings view initialized...");
			this.listenTo(App, "alertPrimaryAction", this.alertPrimaryAction);
			this.listenTo(App, "alertSecondaryAction", this.alertSecondaryAction);

			$(document.body).delegate("#save-logo", "click", this.startPictureUpload);
		},

		onShow : function(){
			ga('create', 'UA-52257201-1', 'hotschedulespost.com');
      		ga('send', 'pageview', '/settings');
		},

		alertPrimaryAction : function(){
			var listener = $("#app-alert").attr("data-listener");
			switch(listener){
				case "picture":
					this.completeRemovePicture();
				break;
			}
		},

		alertSecondaryAction : function(){
			var listener = $("#app-alert").attr("data-listener");
			switch(listener){
				case "picture":
					this.cancelRemovePicture();
				break;
			}
		},

		uploadPicture : function(){
			$("#picture-file").click();
		},

		resizePicture : function(){
			$(document).find("#app-alert-resize-logo .alert-title").text("Your Picture");
			var picture = $("#picture-file")[0].files[0];
			if(picture.size > 4194304){
				Utils.ShowAlert({ listener : "picture", title : "File Size Too Large", message : "The selected image file size is too large and exceeds the allowed limit of 4MB", primary : false, secondaryText : "Ok" });
			}else{

				var _URL = window.URL || window.webkitURL;
				var image = new Image();
	    		image.src = _URL.createObjectURL(picture);

	    		var filetype = picture.type;
	    		var isImageFile = filetype === "image/jpg" || filetype === "image/jpeg" || filetype === "image/gif" || filetype === "image/png";

	    		if(isImageFile){
	    			image.onload = function(){
		    			var alert = $("#app-alert-resize-logo");
		    			var overlay = $(alert).find(".resize-logo-container .overlay")
		    			
		    			$(alert).find(".resize-logo-container .overlay").after("<img class='resize-logo-image' src='"+image.src+"'/>");
						$(alert).addClass("show");
						$(document).find("#app-modal").addClass("show");

						var containerWidth = $(".resize-logo-container").width();
						var containerHeight = $(".resize-logo-container").height();

						var imagePosition = $(".resize-logo-image").offset();
						var imageWidth = $(".resize-logo-image").width();
						var imageHeight = $(".resize-logo-image").height();
								
						var x1 = (imagePosition.left + containerWidth) - imageWidth;
						var y1 = (imagePosition.top + containerHeight) - imageHeight;
						var x2 = imagePosition.left;
						var y2 = imagePosition.top;

						$(".resize-logo-image").draggable({containment : [x1,y1,x2,y2]});
		    		}
	    		}else{
	    			Utils.ShowToast({ message : "Unsupported file type"});
	    		}
	    		
			}
		},

		startPictureUpload : function(event){

			var guid = App.session.getEmployerGUID();

			var container = $(document).find(".resize-logo-container");
			var containerX = $(container).offset().left;
			var containerY = $(container).offset().top;

			var image = $(document).find(".resize-logo-image");
			var imageWidth = $(image).width();
			var imageHeight = $(image).height();

			var imageX = $(image).offset().left;
			var imageY = $(image).offset().top;

			var crop = new Object();
				crop.imageWidth = imageWidth;
				crop.imageHeight = imageHeight;
				crop.cropWidth = 200;
				crop.cropHeight = 200;
				crop.cropFromX = containerX - imageX;
				crop.cropFromY = containerY - imageY;

			var params = new Blob([JSON.stringify(crop)], { type: "application/json"});
			
			$(document).find("#app-alert-resize-logo").removeClass("show");
			$(document).find("#app-modal").removeClass("show");
			$(document).find("#app-alert-resize-logo img.resize-logo-image").remove();
			$(document).find(".resize-slider-container .slider .handle").css("left", 75);

			var picture = $("#picture-file")[0].files[0];

			var data = new FormData();
				data.append("file", picture);
				data.append("params", params, null);
				
				

			var restURL = Utils.GetURL("/services/rest/employer/logo/");

			//$.ajax({
			//	url : restURL+guid,
			//	data : data,
			//	type : "POST",
			//	dataType : "json",
			//	cache : false,
			//	contentType : false,
			//	processData: false,
	    	//	success : function(response){
	    	//		$("#logo").remove();
			//		$(".logo-container .logo").append("<img id='logo' src='"+response.url+"?"+(new Date().getTime())+"'/>");
	    	//	},
	    	//	error : function(){
	    	//		console.log("Error uploading logo...");
			//		Utils.ShowToast({ message : "Error uploading logo..."});
	    	//	}
			//});

		},

		removePicture : function(){
			Utils.ShowAlert({listener : "picture", primary : true, primaryType : "destroy", primaryText : "Remove", title : "Remove Picture", message : "Are you sure you want to remove the Profile Picture?" });
		},

		completeRemovePicture : function(){

			Utils.HideAlert();

			var pictureImage = $("#picture");

			if($(pictureImage).length > 0){
				
				var employerGUID = App.session.getEmployerGUID();
				//var picture = new EmployerLogo({id : 0, guid : employerGUID});

				//picture.destroy({
				//	dataType : "text",
				//	success : function(){
				//		$(".picture-container .picture").html("");
				//		$("#picture-action .custom-select-button").text("Update Picture");
				//	},
				//	error : function(){
				//		console.log("Error removing admin...");
				//		Utils.ShowToast({ message : "Error removing picture..."});
				//	}
				//})

			}else{
				$(".picture-container .picture").html("");
				$("#picture-action .custom-select-button").text("Update Picture");
			}

		},

		cancelRemovePicture : function(){
			Utils.HideAlert();
			$("#picture-action .custom-select-button").text("Update Picture");
		},


		saveSettings : function(){

			$("input").removeClass("error");

			var firstname = $("#firstname").val();
			var lastname = $("#lastname").val();
			var current = $("#current").val();
			var password = $("#password").val();
			var confirm = $("#confirm").val();

			if(current === ""){
				Utils.ShowToast({ message : "Current password is required"});
				$("#current").addClass("error");
			}else if(password === ""){	
				Utils.ShowToast({ message : "New password is required"});
				$("#password").addClass("error");
			}else if(confirm === ""){	
				Utils.ShowToast({ message : "Confirm password is required"});
				$("#confirm").addClass("error");
			}else if(password.length < 8){
				Utils.ShowToast({message : "Password too short (8 characters min)"});
				$("#password").addClass("error");
			}else if(password !== confirm){
				Utils.ShowToast({ message : "New password does not match confirm password"});
				$("#password").addClass("error");
				$("#confirm").addClass("error");
			}else{

				var user = this.model;
				var restURL = Utils.GetURL("/services/rest/user/");

				$.ajax({
					url : restURL+user.guid+"/password",
					type : "PUT",
					contentType: "application/x-www-form-urlencoded; charset=UTF-8",
					data : {"currentPassword" : current, "newPassword" : confirm},
	    			success : function(){
	    				Utils.ShowToast({ message : "Password saved"});
						$("#current").val("");
						$("#password").val("");
						$("#confirm").val("");
	    			},
	    			error : function(response){
	    				if(response.status === 400){
	    					console.log("Error saving user information...");
							Utils.ShowToast({ message : "Current password is incorrect"});
	    				}
	    			}
				});

			}

			
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.user = this.model;
				jsonObject.language = App.Language;
				jsonObject.breadcrumb = App.getTrail();
			return jsonObject;
		}
		
	});

	return ViewSettings;
});