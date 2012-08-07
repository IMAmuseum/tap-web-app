jQuery(function() {
	AppRouter = Backbone.Router.extend({
		// define routes
		views: {},
		routes: {
			'': 'list',
			'map': 'map',
			'tour/:tour_id': 'tourDetails',
			'tourkeypad/:tour_id': 'tourKeypad',
			'tourstop/:tour_id/:stop_id': 'tourStopById',
			'tourstop/:tour_id/code/:stop_code': 'tourStopByCode',
			'tourmap/:tour_id': 'tourMap',
			'tourstoplist/:tour_id': 'tourStopList'
		},
		bookmarkMode:false,


		initialize:function () {
			//console.log('AppRouter::initialize');
			$('#back-button').live('click', function(e) {
				e.preventDefault();
				window.history.back();
				return false;
			});
			this.firstPage = true;
		},


		/**
		 * Route to the tour listing
		 */
		list: function() {

			this.changePage(new TapAPI.views.TourList({model: tap.tours}));

		},


		/**
		 * Route to the overall map view
		 */
		map: function() {

			var map_options = {
				stops: new TapAPI.collections.Stops()
			};

			// Find all of the geolocated stops in the tour set
			_.each(tap.tours.models, function(tour) {
				tap.tours.selectTour(tour.id);
				_.each(tap.tourStops.models, function(stop) {
					var assets = stop.getAssetsByUsage('geo');
					if (assets !== undefined) {
						map_options['stops'].add(stop);
					}
				});
			});

			// Set the current view
			this.changePage(new TapAPI.views.Map(map_options));

			$('#index-selector').replaceWith("<h1 id='page-title' class='ui-title'>Map</h2>");

		},


		/**
		 * Route to the tour details
		 * @param id The id of the tour
		 */
		tourDetails: function(id) {

			tap.tours.selectTour(id);
			this.changePage(new TapAPI.views.TourDetails({model: tap.tours.get(tap.currentTour)}));

		},

		/**
		 * Route to the keypad
		 * @param id The id of the tour
		 */
		tourKeypad: function(id) {

			tap.tours.selectTour(id);
			this.changePage(new TapAPI.views.Keypad({
				model: tap.tours.get(tap.currentTour),
				page_title: "Enter a code"
			}));

		},

		/**
		 * Route to a stop
		 */
		tourStop: function() {

			var api_class = TapAPI.views.registry[tap.currentStop.get('view')];
			if (api_class === undefined) {
				console.log('View not in registry: ', tap.currentStop.get('view'));
				api_class = 'Stop';
			}

			this.changePage(new TapAPI.views[api_class]({
				model: tap.currentStop,
				page_title: tap.tours.get(tap.currentTour).get('title')[0].value
			}));

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
			var options = {
				model: tap.tours.get(tap.currentTour)
			};
			if (tap.config.StopListView !== undefined) {
				options = _.extend(options, tap.config.StopListView);
			}
			this.changePage(new TapAPI.views.StopList(options));

		},


		/**
		 * Route to the tour map
		 * Certain parameters are determined here in the router to leave open the possibility of 
		 * plotting markers for several tours on the same map
		 */
		tourMap: function(id) {

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
				var content = asset.get('content');
				if (content === undefined) return;
				var data = $.parseJSON(content.at(0).get('data'));

				if (data.type == 'Point') {
					map_options['init-lon'] = data.coordinates[0];
					map_options['init-lat'] = data.coordinates[1];
				}

			});

			// Look to see if the initial map zoom level is set
			_.each(tour.get('propertySet').models, function(property) {
				if (property.get('name') == 'initial_map_zoom') {
					map_options['init-zoom'] = property.get('value');
				}
			});

			// Set the current view
			this.changePage(new TapAPI.views.Map(map_options));

		},

		changePage: function(page) {

			// Close the current view to unbind events, etc.
			if (tap.currentView !== undefined) {
				tap.currentView.close();
			}

			tap.currentView = page;

			$(page.el).attr('data-role', 'page');
			page.render();
			$('body').append($(page.el));
			var transition = $.mobile.defaultPageTransition;

			// We don't want to slide the first page
			if (this.firstPage) {
				transition = 'none';
				this.firstPage = false;
			}
			$.mobile.changePage($(page.el), {changeHash:false, transition: transition});

			// The old page is removed from the DOM by an event handler in jqm-config.js

		},

		showDialog: function(id, content) {

			var dialog = TapAPI.templateManager.get('dialog')({
				id: id,
				content: content
			});
			$('body').append(dialog);
			$.mobile.changePage('#' + id, {changeHash:false, transition:'pop'});

		}

	});
});
