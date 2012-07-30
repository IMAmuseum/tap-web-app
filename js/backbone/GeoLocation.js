// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
// TapAPI Namespace Initialization //

jQuery(function() {

	// Check for geolocation support
	if (!navigator.geolocation) return;

	TapAPI.geoLocation = {

		latest_location: null,
		interval: null,

		locate: function() {

			navigator.geolocation.getCurrentPosition(
				TapAPI.geoLocation.locationReceived,
				TapAPI.geoLocation.locationError
			);

		},

		locationReceived: function(position) {
			//console.log('got location', position);
			TapAPI.geoLocation.latest_location = position;
			TapAPI.geoLocation.computeStopDistance(position);
			TapAPI.geoLocation.trigger('gotlocation', position);
		},

		locationError: function(error) {
			console.log('locationError', error);
		},

		// Parse the current stop locations. Should be triggered when a new tour is selected.
		parseCurrentStopLocations: function() {

			_.each(tap.tourStops.models, function(stop) {

				if (stop.get('location') === undefined) {

					var geo_assets = stop.getAssetsByUsage('geo');
					if (geo_assets) {

						// Parse the contents of the asset
						var content = geo_assets[0].get('content');
						if (content === undefined) return;
						var data = $.parseJSON(content.at(0).get('data'));

						if (data.type == 'Point') {
							stop.set('location', new L.LatLng(data.coordinates[1], data.coordinates[0]));
						}

					}

				}

			});

		},

		computeStopDistance: function(position) {

			var latlon = new L.LatLng(position.coords.latitude, position.coords.longitude);

			_.each(tap.tourStops.models, function(stop) {

				var stop_location = stop.get('location');
				if (stop_location !== undefined) {
					var d = latlon.distanceTo(stop_location);
					stop.set('distance', d);
				}

			});

		},

		startLocating: function(delay) {

			if (delay === undefined) delay = 5000;
			TapAPI.geoLocation.locate();
			TapAPI.geoLocation.interval = setInterval(TapAPI.geoLocation.locate, 5000);

		},

		stopLocating: function() {
			clearInterval(TapAPI.geoLocation.interval);
			TapAPI.geoLocation.interval = null;
		},


		formatDistance: function(d) {

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

		}

	};

	_.extend(TapAPI.geoLocation, Backbone.Events);

});