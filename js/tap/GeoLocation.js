define([
    'jquery',
    'underscore',
    'tap/TapAPI'
], function($, _, TapAPI) {
	// Check for geolocation support
	if (!navigator.geolocation) return;

	var geoLocation = {
		latest_location: null,
		watch: null,
		nearest_stop: null,
		active_stop_collection: null,
		locate: function() {
			navigator.geolocation.getCurrentPosition(
				TapAPI.geoLocation.locationReceived,
				TapAPI.geoLocation.locationError,
				{
					enableHighAccuracy: tap.config.geolocation.enableHighAccuracy
				}
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
			var nearest = null;
			var stops = tap.tourStops;
			if (this.active_stop_collection !== null) {
				stops = this.active_stop_collection;
			}

			_.each(stops.models, function(stop) {
				var stop_location = stop.get('location');
				if (stop_location !== undefined) {
					var d = latlon.distanceTo(stop_location);
					stop.set('distance', d);
					if ((nearest === null) || (d < nearest.get('distance'))) {
						nearest = stop;
					}
				}
			});

			if (nearest !== null) {
				if (this.nearest_stop === null) {
					this.nearest_stop = nearest;
				} else if (this.nearest_stop != nearest) {
					// update
					this.nearest_stop.set('nearest', false);
				}
				nearest.set('nearest', true);
			}
		},
		startLocating: function(delay) {
			this.watch = navigator.geolocation.watchPosition(
				TapAPI.geoLocation.locationReceived,
				TapAPI.geoLocation.locationError,
				{
					enableHighAccuracy: tap.config.geolocation.enableHighAccuracy
				}
			);
		},
		stopLocating: function() {
			navigator.geolocation.clearWatch(this.watch);

			if (this.nearest_stop !== null) {
				this.nearest_stop.set('nearest', false);
				this.nearest_stop = null;
			}
		},
		formatDistance: function(d) {
			if (d === undefined) return '';

			if (tap.config.units == 'si') {
				if (d < 100) {
					return parseInt(d, 10) + ' m';
				} else if (d < 10000) {
					return (d/1000).toFixed(2) + ' km';
				} else {
					return parseInt(d/1000, 10) + ' km';
				}
			} else {
				// Assume it's English
				var feet = 3.28084 * d;
				if (feet > 52800) { // > 10 miles
					return parseInt(feet/5280, 10) + ' mi';
				} if (feet > 528) { // > .1 miles
					return (feet/5280).toFixed(2) + ' mi';
				} else {
					return parseInt(feet, 10) + ' ft';
				}

			}

		}

	};
	return geoLocation;
});