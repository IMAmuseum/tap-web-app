jQuery(function() {
	AppRouter = Backbone.Router.extend({
		// define routes
		views: {},
		routes: {
			'': 'list',
			'tour/:id': 'tourDetails',
			'tourkeypad/:id': 'tourKeypad',
			'tourstop/:id/:keycode': 'tourStop',
			'tourmap': 'tourMap'
		},
		bookmarkMode:false,

		/**
		 * Show the view of the given class
		 * @param selector   Selector for the element to render within
		 * @param view_class The class of the view to render
		 * @note The view will attempt to render the current stop
		 */
		showView: function(selector, view_class) {

			// Close the current view
			// TODO: Check if the class is the same?
			if (tap.currentView){
				tap.currentView.close();
			}

			// See if we have one of these views instantiated already
			if (this.views[view_class] == undefined) {
				this.views[view_class] = new TapAPI.views[view_class]();
			}

			// Render the view into the given element
			$(selector).html(this.views[view_class].render().el);
			tap.currentView = this.views[view_class];
			return tap.currentView;
		},

		list: function() {
			// have jqm change pages
			$.mobile.changePage('#tours', {transition: 'fade', reverse: true, changeHash: false});
			// setup list view of all the tours and render
			this.tourListView = new TourListView({model: tap.tours});
			tap.currentView = this.tourListView;
			this.tourListView.render();
		},

		/**
		 * Route to the tour details 
		 * @param id The id of the tour
		 */
		tourDetails: function(id) {
			// set the selected tour
			tap.tours.selectTour(id);
			// have jqm change pages
			$.mobile.changePage('#tour-details', { transition: 'fade', reverse: false, changeHash: false});
			// change the page title
			$('#tour-details #page-title').html(tap.tours.get(tap.currentTour).get('title')[0].value);
			// attach the tour id to the get started button
			$('#tour-details #start-tour-id').attr("href", "#tourkeypad/"+id);
			this.showView('#content', 'TourDetails');
		},

		/**
		 * Route to the keypad
		 * @param id The id of the tour
		 */
		tourKeypad: function(id) {
			// set the selected tour
			tap.tours.selectTour(id);
			// have jqm change pages
			$.mobile.changePage('#tour-keypad', { transition: 'fade', reverse: false, changeHash: false});
			// change the page title
			$('#tour-details #page-title').html(tap.tours.get(tap.currentTour).get('title')[0].value);
			this.showView('#content', 'Keypad');
		},

		/**
		 * Route to the stop with the given code
		 * @param id      The tour ID
		 * @param keycode The code for the stop
		 */
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
				this.showView('#content', api_class);
			} else {
				console.log('View not in registry: ', tap.currentStop.get('view'));
				this.showView('#content', 'Stop');
			}

		},

		/**
		 * Route to the tour map
		 */
		tourMap: function() {
			$.mobile.changePage('#tour-map-page', { transition: 'fade', reverse: false, changeHash: false});
			this.showView('#content', 'Map');
		}

	});
});
