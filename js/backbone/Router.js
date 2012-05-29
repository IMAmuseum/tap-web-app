jQuery(function() {
	AppRouter = Backbone.Router.extend({
		// define routes
		views: {},
		routes: {
			'': 'list',
			'tour/:id': 'tourDetails',
			'tourkeypad/:id': 'tourKeypad',
			'tourstop/:id/:keycode': 'tourStop'
		},
		bookmarkMode:false,
		showView: function(selector, view) {
			if (tap.currentView){
				tap.currentView.close();
			}
			$(selector).html(view.render().el);
			tap.currentView = view;
			return view;
		},
		list: function() {
			// have jqm change pages
			$.mobile.changePage('#tours', {transition: 'fade', reverse: true, changeHash: false});
			// setup list view of all the tours and render
			this.tourListView = new TourListView({model: tap.tours});
			tap.currentView = this.tourListView;
			this.tourListView.render();

		},
		tourDetails: function(id) {
			// set the selected tour
			tap.tours.selectTour(id);
			// have jqm change pages
			$.mobile.changePage('#tour-details', { transition: 'fade', reverse: false, changeHash: false});
			// change the page title
			$('#tour-details #page-title').html(tap.tours.get(tap.currentTour).get('title')[0].value);
			// attach the tour id to the get started button
			$('#tour-details #start-tour-id').attr("href", "#tourkeypad/"+id);
			// setup detailed view of tour and render
			this.tourDetailedView = new TourDetailedView();
			app.showView('#content', this.tourDetailedView);
		},
		tourKeypad: function(id) {
			// set the selected tour
			tap.tours.selectTour(id);
			// have jqm change pages
			$.mobile.changePage('#tour-keypad', { transition: 'fade', reverse: false, changeHash: false});
			// change the page title
			$('#tour-details #page-title').html(tap.tours.get(tap.currentTour).get('title')[0].value);
			// setup detailed view of keypad and render
			this.tourKeypadView = new TourKeypadView(id);
			app.showView('#content', this.tourKeypadView);
		},
		tourStop: function(id, keycode) {
			// set the selected tour
			tap.tours.selectTour(id);
			// have jqm change pages
			$.mobile.changePage('#tour-stop', { transition: 'fade', reverse: false, changeHash: false});
			// change the page title
			$('#tour-stop #page-title').html(tap.tours.get(tap.currentTour).get('title')[0].value);
			// setup detailed view of tour and render
			tap.currentStop = tap.tourStops.getStopByKeycode(keycode);

			// Look up the class to instantiate in the views registry
			var api_class = TapAPI.views.registry[tap.currentStop.get('view')];
			if (api_class != undefined) {
				// TODO: Try to show the view first, create if it doesn't exist?
				var view = new TapAPI.views[api_class]();
				app.showView('#content', view);
				return;
			} else {
				console.log('View not in registry: ', tap.currentStop.get('view'));
				var view = new TapAPI.views.Stop();
				app.showView('#content', view);	
				return;
			}

		}
	});
});
