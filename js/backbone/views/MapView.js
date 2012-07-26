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
	TapAPI.views.Map = TapAPI.views.Page.extend({

		onInit: function() {
			console.log('MapView.initialize');

			this.options.active_index = 'tourmap';

			this.tile_layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>',
				maxZoom: 18
			});

			this.map = null;
			this.stop_markers = {};
			this.stop_popups = {};
			this.position_marker = null;
			this.view_initialized = false;
			this.LocationIcon = L.Icon.extend({
				iconUrl: tap.base_path + 'images/icon-locate.png',
				shadowUrl: null,
				iconSize: new L.Point(24, 24),
				iconAnchor: new L.Point(12, 12)
			});
			this.MarkerIcon = L.Icon.extend({
				iconUrl: tap.base_path + 'images/marker.png',
				shadowUrl: tap.base_path + 'images/marker-shadow.png',
				iconSize: new L.Point(25,41),
				iconAnchor: new L.Point(12,41)
			});
			this.marker_icon = new this.MarkerIcon();

			_.defaults(this.options, {
				'init-lat': 39.829104,
				'init-lon': -86.189504,
				'init-zoom': 2
			});
		},

		renderContent: function() {

			TapAPI.geoLocation.startLocating();

			var content_template = TapAPI.templateManager.get('tour-map');

			//$(":jqmData(role='page')", this.$el).attr('id', 'tour-map-page');
			$(":jqmData(role='content')", this.$el).addClass('map-content').append(content_template());

			$(":jqmData(role='page')").live('pageshow', {map_view: this}, function(e) {
				e.data.map_view.resizeContentArea();
				if (e.data.map_view.map === null) {
					e.data.map_view.initMap();
				}
				setTimeout(e.data.map_view.resizeContentArea, 2000);
			});

			$(window).bind('orientationchange resize', this.resizeContentArea);
			//$(":jqmData(role='page')").bind('updatelayout', function() { alert('x'); });

		},


		initMap: function() {

			//$(this.el).html(this.template());
			this.map = new L.Map('tour-map');

			this.map.addLayer(this.tile_layer);

			// First, try to set the view by locating the device
			//this.map.locateAndSetView(this.options['init-zoom']);
			if (TapAPI.geoLocation !== null) {
				if (TapAPI.geoLocation.latest_location !== null) {

					this.options['init-lat'] = TapAPI.geoLocation.latest_location.coords.latitude;
					this.options['init-lon'] = TapAPI.geoLocation.latest_location.coords.longitude;

					if (this.position_marker === null) {
						this.position_marker = new L.Marker(
							new L.LatLng(this.options['init-lat'], this.options['init-lon']),
							{icon: new this.LocationIcon()}
						);
						this.map.addLayer(this.position_marker);
					}

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

			TapAPI.geoLocation.on("gotlocation", this.onLocationFound, this);

			return this;
		},


		// Plot a single tour stop marker on the map
		// @note Assumes that the context is set to { stop: (StopModel), map_view: (MapView) }
		plotTourStopMarker: function(asset_ref) {

			// Make sure this is a geo asset reference
			if ((asset_ref === undefined) || (asset_ref.usage != 'geo')) return;

			// Parse the contents of the asset
			asset = tap.tourAssets.get(asset_ref.id);
			var content = asset.get('content');
			if (content === undefined) return;
			var data = $.parseJSON(content.at(0).get('data'));

			if (data.type == 'Point') {

				var marker_location = new L.LatLng(data.coordinates[1], data.coordinates[0]);
				var marker = new L.Marker(marker_location, { icon: this.map_view.marker_icon });
				var template = TapAPI.templateManager.get('tour-map-marker-bubble');

				var popup = new L.Popup();
				popup.setLatLng(marker_location);

				var d_content = '';
				if (this.stop.get('distance')) {
					d_content = 'Distance: ' + this.map_view.formatStopDistance(this.stop.get('distance'));
				}

				popup.setContent(template({
					'title': this.stop.get('title'),
					'tour_id': tap.currentTour,
					'stop_id': this.stop.id,
					'distance': d_content,
					'stop_lat': data.coordinates[1],
					'stop_lon': data.coordinates[0]
				}));

				this.map_view.stop_popups[this.stop.id] = popup;

				marker.stop_id = this.stop.id;
				marker.addEventListener('click', this.map_view.onMarkerSelected, this.map_view);

				this.map_view.stop_markers[this.stop.id] = marker;
				this.map_view.map.addLayer(marker);

			}

			// Update the marker bubble when the distance to a stop changes
			this.stop.on('change:distance', function(stop) {

				var d_content = '';
				if (stop.get('distance')) {
					d_content = 'Distance: ' + this.formatStopDistance(stop.get('distance'));
				}

				this.stop_popups[stop.id].setContent(template({
					'title': stop.get('title'),
					'tour_id': tap.currentTour,
					'stop_id': stop.get('id'),
					'distance': d_content,
					'stop_lat': stop.get('location').lat,
					'stop_lon': stop.get('location').lng
				}));

			}, this.map_view);

		},


		// When a marker is selected, show the popup
		// Assumes that the context is set to (MapView)
		onMarkerSelected: function(e) {
			this.map.openPopup(this.stop_popups[e.target.stop_id]);
		},


		onLocationFound: function(position) {

			//console.log('onLocationFound', position);
			var latlng = new L.LatLng(position.coords.latitude, position.coords.longitude);

			if (this.position_marker === null) {

				this.position_marker = new L.Marker(latlng, {icon: new this.LocationIcon()});
				this.map.addLayer(this.position_marker);

			} else {

				this.position_marker.setLatLng(latlng);

			}

		},


		onLocationError: function(e) {

			console.log('onLocationError', e);

			// TODO: hide the position marker?

		},


		formatStopDistance: function(d) {

			if (tap.config.units == 'si') {

				if (d < 100) {
					return parseInt(d) + ' m';
				} else if (d < 10000) {
					return (d/1000).toFixed(2) + ' km';
				} else {
					return parseInt(d/1000) + ' km';
				}

			} else {
				
				// Assume it's English
				var feet = 3.28084 * d;
				if (feet > 52800) { // > 10 miles
					return parseInt(feet/5280) + ' mi';
				} if (feet > 528) { // > .1 miles
					return (feet/5280).toFixed(2) + ' mi';
				} else {
					return parseInt(feet) + ' ft';
				}

			}

		},


		resizeContentArea: function() {
			var content, contentHeight, footer, header, viewportHeight;
			window.scroll(0, 0);
			var tour_map_page = $(":jqmData(role='page')");
			header = tour_map_page.find(":jqmData(role='header'):visible");
			footer = tour_map_page.find(":jqmData(role='footer'):visible");
			content = tour_map_page.find(":jqmData(role='content'):visible");
			viewportHeight = $(window).height();
			contentHeight = viewportHeight - header.outerHeight() - footer.outerHeight();
			tour_map_page.find(":jqmData(role='content')").first().height(contentHeight);
		},


		onClose: function() {
			TapAPI.geoLocation.stopLocating();
			$(window).unbind('orientationchange resize', this.resizeContentArea);
		}

	});

});