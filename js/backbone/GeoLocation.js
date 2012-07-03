// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
// TapAPI Namespace Initialization //

jQuery(function() {

	// Check for geolocation support
	if (!navigator.geolocation) return;	

	TapAPI.geoLocation = {

		latest_location: null,

		locate: function() {

			navigator.geolocation.getCurrentPosition(
				TapAPI.geoLocation.locationReceived, 
				TapAPI.geoLocation.locationError
			);

		},

		locationReceived: function(position) {
			console.log('got location', position);
			TapAPI.geoLocation.latest_location = position;
			TapAPI.geoLocation.trigger('gotlocation');
		},

		locationError: function(error) {
			console.log('locationError', error);
		},

		computeStopDistance: function(location) {

			console.log(stops);

		}

	};

	_.extend(TapAPI.geoLocation, Backbone.Events);

	TapAPI.geoLocation.locate();
	setInterval(TapAPI.geoLocation.locate, 5000);

});