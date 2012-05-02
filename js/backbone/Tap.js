(function($){
	// initialize jqm properties to allow backbone to handle routing
	$.mobile.hashListeningEnabled = false;
	$.mobile.linkBindingEnabled = false;
	$.mobile.pushStateEnabled = false;		

	$(document).ready(function() {
		// specify url to tourML document
		tap.url = 'data/TourMLTourSetInternal.xml';
		// initialize app
		tap.initApp();
		// initialize router
		app = new AppRouter();
		// start backbone history collection
		Backbone.history.start();
		// override click event for back button
		$('body').find(":jqmData(rel='back')").click(function(e) {
			e.preventDefault();
			window.history.back();
		});

	});		
}(jQuery));		
