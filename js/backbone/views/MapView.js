// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //


/**
 * The MapView supports the display of multiple tours or a single tour
 */

jQuery(function() {

	// Define the Map View
	TapAPI.views.Map = Backbone.View.extend({

		el: $('#tour-map-page').find(":jqmData(role='content')"),
		template: TapAPI.templateManager.get('tour-map'),
		options: {
			'init-lat': 39.829104,
			'init-lon': -86.189504,
			'init-zoom': 2
		},
		map: null,
		tile_layer: null,
		view_initialized: false,
		latest_location: null,
		LocationIcon: L.Icon.extend({
			iconUrl: 'assets/images/icon-locate.png',
			shadowUrl: null,
			iconSize: new L.Point(24, 24),
			iconAnchor: new L.Point(12, 12)
		}),
		stop_markers: {},
		units: 'si',

		render: function() {

			$('#tour-map-page').live('pageshow', {map_view: this}, function(e) {
				e.data.map_view.resizeContentArea();
				if (e.data.map_view.map === null) {
					e.data.map_view.initMap();
				}
			});

			$(window).bind('orientationchange resize', this.resizeContentArea);

		},


		initMap: function() {

			$(this.el).html(this.template());
			this.map = new L.Map('tour-map');

			this.tile_layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>',
				maxZoom: 18
			});
			this.map.addLayer(this.tile_layer);

			// Set up location event callbacks
			//this.map.addEventListener('locationfound', this.onLocationFound, this);
			//this.map.addEventListener('locationerror', this.onLocationError, this);

			// First, try to set the view by locating the device
			//this.map.locateAndSetView(this.options['init-zoom']);
			if (TapAPI.geoLocation !== null) {
				if (TapAPI.geoLocation.latest_location !== null) {

					this.options['init-lat'] = TapAPI.geoLocation.latest_location.coords.latitude;
					this.options['init-lon'] = TapAPI.geoLocation.latest_location.coords.longitude;

				}
			}

			this.map.setView(
				new L.LatLng(this.options['init-lat'], this.options['init-lon']),
				this.options['init-zoom']
			);			

			// Find stops with geo coordinate assets
			for (var i = 0; i<this.options.stops.size(); i++) {

				var tour_stop = this.options.stops.at(i);
				var asset_refs = tour_stop.get('assetRef');
				var result = _.each(
					asset_refs,
					this.plotTourStopMarker,
					{
						stop: tour_stop,
						map_view: this
					}
				);

			}

			TapAPI.geoLocation.on("gotlocation", function() {console.log('foo');});

			return this;
		},


		// Plot a single tour stop marker on the map
		// @note Assumes that the context is set to { stop: (StopModel), map_view: (MapView) }
		plotTourStopMarker: function(asset_ref) {

			// Make sure this is a geo asset reference
			if ((asset_ref === undefined) || (asset_ref.usage != 'geo')) return;

			// Parse the contents of the asset
			asset = tap.tourAssets.get(asset_ref.id);
			var data = $.parseJSON(asset.get('content')[0].data.value);

			if (data.type == 'Point') {

				var marker_location = new L.LatLng(data.coordinates[1], data.coordinates[0]);
				var marker = new L.Marker(marker_location);
				var template = TapAPI.templateManager.get('tour-map-marker-bubble');

				marker.bindPopup(template({
					'title': this.stop.get('title')[0].value,
					'tour_id': tap.currentTour,
					'stop_id': this.stop.id
				}));

				this.map_view.stop_markers[this.stop.id] = marker;
				this.map_view.map.addLayer(marker);

			}

		},


		onLocationFound: function(e) {

			console.log('onLocationFound', e);
			var radius = e.accuracy / 2;

			var marker = new L.Marker(e.latlng, {icon: new this.LocationIcon()});
			this.map.addLayer(marker);
			//marker.bindPopup("You are within " + radius + " meters from this point").openPopup();

			var circle = new L.Circle(e.latlng, radius);
			this.map.addLayer(circle);

			this.latest_location = e.latlng;
			this.view_initialized = true;

			this.calculateStopDistance();

		},


		onLocationError: function(e) {

			console.log('onLocationError', e);

			// If the map view has not been initialized,
			// set the view to the initial center and zoom
			if (!this.view_initialized) {
				this.map.setView(
					new L.LatLng(this.options['init-lat'], this.options['init-lon']),
					this.options['init-zoom']
				);
				this.view_initialized = true;
			}

		},


		calculateStopDistance: function() {

			if (this.latest_location === null) return;

			var nearest = null;
			for (var stop_id in this.stop_markers) {
				var d = this.latest_location.distanceTo(this.stop_markers[stop_id].getLatLng());
				console.log(d);
				if ((nearest === null) || (nearest.distance > d)) {
					nearest = { id: stop_id, distance: d };
				}
			}

			console.log('nearest: ', nearest.distance);

		},


		resizeContentArea: function() {
			var content, contentHeight, footer, header, viewportHeight;
			window.scroll(0, 0);
			var tour_map_page = $('#tour-map-page');
			header = tour_map_page.find(":jqmData(role='header'):visible");
			footer = tour_map_page.find(":jqmData(role='footer'):visible");
			content = tour_map_page.find(":jqmData(role='content'):visible");
			viewportHeight = $(window).height();
			contentHeight = viewportHeight - header.outerHeight() - footer.outerHeight();
			tour_map_page.find(":jqmData(role='content')").first().height(contentHeight);
		},


		close: function() {
			$(window).unbind('orientationchange resize', this.resizeContentArea);
		}

	});

});