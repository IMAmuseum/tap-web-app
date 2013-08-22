TapAPI.geoLocation = {
    latestLocation: null,
    watch: null,
    nearestStop: null,

    locate: function() {
        if (!navigator.geolocation) return;

        var that = this;
        navigator.geolocation.getCurrentPosition(
            function(position) {
                that.locationReceived(position);
            },
            that.locationError, {
                enableHighAccuracy: true
            }
        );
    },

    locationReceived: function(position) {
        this.latestLocation = position;
        this.computeStopDistance(position);
        Backbone.trigger('geolocation.location.recieved', position);
    },

    locationError: function(error) {
        console.log('locationError', error);
    },

    // Parse the current stop locations. Should be triggered when a new tour is selected.
    parseCurrentStopLocations: function() {
        _.each(TapAPI.tourStops.models, function(stop) {
            if (stop.get('location') === undefined) {
                var geoAssets = stop.getAssetsByUsage('geo');
                if (geoAssets) {
                    // Parse the contents of the asset
                    var content = geoAssets[0].get('content');
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
        var latlong = new L.LatLng(position.coords.latitude, position.coords.longitude);
        var nearest = null;

        _.each(TapAPI.tourStops.models, function(stop) {
            var stopLocation = stop.get('location');
            if (!_.isUndefined(stopLocation)) {
                var d = latlong.distanceTo(stopLocation);
                stop.set('distance', d);
                if (_.isNull(nearest) || d < nearest.get('distance')) {
                    nearest = stop;
                }
            }
        });

        if (nearest !== null) {
            if (this.nearestStop === null) {
                this.nearestStop = nearest;
            } else if (this.nearestStop != nearest) {
                // update
                this.nearestStop.set('nearest', false);
            }
            nearest.set('nearest', true);
        }
    },

    startLocating: function(delay) {
        if (!navigator.geolocation) return;

        var that = this;
        this.watch = navigator.geolocation.watchPosition(
            function(position) {
                that.locationReceived(position);
            },
            that.locationError, {
                enableHighAccuracy: true
            }
        );
    },

    stopLocating: function() {
        if (!navigator.geolocation) return;
        
        navigator.geolocation.clearWatch(this.watch);

        if (this.nearestStop !== null) {
            this.nearestStop.set('nearest', false);
            this.nearestStop = null;
        }
    },

    formatDistance: function(d) {
        if (d === undefined) return '';

        if (TapAPI.geo.units == 'si') {
            if (d < 100) {
                return parseInt(d, 10) + ' m';
            } else if (d < 10000) {
                return (d / 1000).toFixed(2) + ' km';
            } else {
                return parseInt(d/1000, 10) + ' km';
            }
        } else {
            // Assume it's English
            var feet = 3.28084 * d;
            if (feet > 52800) { // > 10 miles
                return parseInt(feet / 5280, 10) + ' mi';
            } if (feet > 528) { // > .1 miles
                return (feet / 5280).toFixed(2) + ' mi';
            } else {
                return parseInt(feet, 10) + ' ft';
            }
        }
    }
};