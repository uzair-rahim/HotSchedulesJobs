require(["brushfire-common-config"], function(common) {
    require(["app", "jobrouter"], function(App, ApplicationRouter){
	    var options = {};
	    var router = new ApplicationRouter();
	    App.router = router;
	    App.start(options);
    })
});