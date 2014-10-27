require(["brushfire-common-config"], function(common) {
    require(["app", "approuter", "utils"], function(App, ApplicationRouter, Utils){
	    var options = {};
	    var router = new ApplicationRouter();
	    App.router = router;
		router.on("route", function(){
			// if user is logged in and verified switch the layout to app mode
			if(App.session.isLoggedIn() && App.session.isVerified()){
				App.layout.toggleLayout("app");
			// if user is not logged in or verified switch the layout to portal mode
			}else{
				App.layout.toggleLayout("portal");
			}
		});
	    App.start(options);
    })
});