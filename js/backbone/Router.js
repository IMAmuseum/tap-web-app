jQuery(function() {
	AppRouter = Backbone.Router.extend({
		// define routes
		views: {},
		routes: {
			'': 'list',
			'tour/:tour_id': 'tourDetails',
			'tourkeypad/:tour_id': 'tourKeypad',
			'tourstop/:tour_id/:stop_id': 'tourStopById',
			'tourstop/:tour_id/code/:stop_code': 'tourStopByCode',
			'tourmap/:tour_id': 'tourMap',
			'tourstoplist/:tour_id': 'tourStopList'
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
			if (this.views[view_class] === undefined) {
				this.views[view_class] = new TapAPI.views[view_class]({model: tap.tours.get(tap.currentTour)});
			}

			// Render the view
			this.views[view_class].render();

			// Set the current view
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
		 * Route to a stop
		 */
		tourStop: function() {

			// have jqm change pages
			$.mobile.changePage('#tour-stop', { transition: 'fade', reverse: false, changeHash: false});
			// change the page title
			$('#tour-stop #page-title').html(tap.tours.get(tap.currentTour).get('title')[0].value);

			// Look up the class to instantiate in the views registry
			var api_class = TapAPI.views.registry[tap.currentStop.get('view')];
			if (api_class !== undefined) {
				this.showView('#content', api_class);
			} else {
				console.log('View not in registry: ', tap.currentStop.get('view'));
				this.showView('#content', 'Stop');
			}

		},

		/**
		 * Route to a stop by stop ID
		 **/
		tourStopById: function(tour_id, stop_id) {

			// set the selected tour
			tap.tours.selectTour(tour_id);
			tap.currentStop = tap.tourStops.get(stop_id);
			this.tourStop();

		},

		/**
		 * Route to a stop by stop code
		 */
		tourStopByCode: function(tour_id, stop_code) {

			// set the selected tour
			tap.tours.selectTour(tour_id);
			tap.currentStop = tap.tourStops.getStopByKeycode(stop_code);
			this.tourStop();

		},


		/**
		 * Route to the tour list
		 * @param id The id of the tour
		 */
		tourStopList: function(id) {
			// set the selected tour
			tap.tours.selectTour(id);
			// have jqm change pages
			$.mobile.changePage('#tour-stop-list-page', { transition: 'fade', reverse: false, changeHash: false});
	
			this.showView('#content', 'StopList');
		},


		/**
		 * Route to the tour map
		 * Certain parameters are determined here in the router to leave open the possibility of 
		 * plotting markers for several tours on the same map
		 */
		tourMap: function(id) {

			$.mobile.changePage('#tour-map-page', { transition: 'fade', reverse: false, changeHash: false});

			// See if we have one of these views instantiated already
			// TODO: If we do, might need to check if it needs to be reset
			if (this.views['Map'] === undefined) {

				// Determine which stops to display
				tap.tours.selectTour(id);
				var map_options = {
					'stops': tap.tourStops
				};

				// Look to see if a location is defined for the tour to use as the initial map center
				var tour = tap.tours.get(tap.currentTour);
				_.each(tour.get('appResource'), function(resource) {

					// Make sure this is a geo asset reference
					if ((resource === undefined) || (resource.usage != 'geo')) return;

					asset = tap.tourAssets.get(resource.id);
					var data = $.parseJSON(asset.get('content')[0].data.value);

					if (data.type == 'Point') {
						map_options['init-lon'] = data.coordinates[0];
						map_options['init-lat'] = data.coordinates[1];
					}

				});

				// Look to see if the initial map zoom level is set
				_.each(tour.get('propertySet'), function(property) {
					if (property.name == 'initial_map_zoom') {
						map_options['init-zoom'] = property.value;
					}
				});

				this.views['Map'] = new TapAPI.views.Map(map_options);

			}

			if (tap.currentView){
				tap.currentView.close();
			}

			// Render the view
			this.views['Map'].render();

			// Set the current view
			tap.currentView = this.views['Map'];

		}

	});
});
