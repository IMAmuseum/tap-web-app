/*
 * Backbone View for displaying the Map navigation interface
 * Relies on leaflet
 */
TapAPI.classes.views.MapView = TapAPI.classes.views.StopSelectionView.extend({
    id: 'tour-map',
    initialize: function(options) {
        var that = this;

        this._super(options);

        this.title = '';
        this.activeToolbarButton = 'MapView';
        this.map = null;
        this.mapOptions = {
            'initialLat': null,
            'initialLong': null,
            'initialZoom': 2
        };
        this.stopMarkers = {};
        this.stopPopups = {};
        this.positionMarker = null;

        TapAPI.geoLocation.parseCurrentStopLocations();

        // Look to see if a location is defined for the tour to use as the initial map center
        var tour = TapAPI.tours.get(TapAPI.currentTour);
        _.each(tour.get('appResource'), function(resource) {
            // Make sure this is a geo asset reference
            if (!_.isUndefined(resource) && resource.usage === 'geo') {
                var asset = TapAPI.tourAssets.get(resource.id);
                var content = asset.get('content');
                if (!_.isUndefined(content)) {
                    var data = $.parseJSON(content.at(0).get('data'));
                    if (data.type === 'Point') {
                        this.mapOptions['initialLong'] = data.coordinates[0];
                        this.mapOptions['initialLat'] = data.coordinates[1];
                    }
                }
            }
        }, this);

        // Look to see if the initial map zoom level is set
        _.each(tour.get('propertySet').models, function(property) {
            if (property.get('name') == 'initial_map_zoom') {
                this.mapOptions['initialZoom'] = property.get('value');
            }
        }, this);

        $(':jqmData(role="page")').on('pageinit', {context: this}, this.resizeMapViewport);
        $(window).on('orientationchange resize', {context: this}, this.resizeMapViewport);
    },
    render: function() {
        return this;
    },
    finishedAddingContent: function() {
        // initialize geo location
        TapAPI.geoLocation.startLocating();

        // create map
        this.map = L.map('tour-map', {
            continuousWorld: true
        });
        // setup tile layer
        this.tileLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/"">CC-BY-SA</a>',
            maxZoom: 18,
            minZoom: 4,
            detectRetina: true
        });
        // add tile layer to map
        this.map.addLayer(this.tileLayer);

        // Add the stop markers
        _.each(TapAPI.tourStops.models, this.plotTourStopMarker, this);

        // Determine the bounding region
        var stopBounds;
        _.each(this.stopMarkers, function(marker) {
            var l = marker.getLatLng(),
                stopBounds = new L.LatLngBounds(l, l);
            if (stopBounds === null) {
                stopBounds = new L.LatLngBounds(l, l);
            } else {
                stopBounds.extend(l);
            }
        });

        // Set the viewport based on settings
        if (_.isNull(this.mapOptions.initialLat) || _.isNull(this.mapOptions.initialLong)) {
            if (_.isUndefined(stopBounds)) {
                this.map.setView(L.latLng(0,0), this.mapOptions.initialZoom);
            } else {
                this.map.fitBounds(stopBounds);
            }
        } else {
            this.map.setView(new L.LatLng(this.mapOptions.initialLat, this.mapOptions.initialLong),
                this.mapOptions.initialZoom);
        }

        // At this point the stop markers should be added to the map
        // We can augment them with the distance labels
        _.each(TapAPI.tourStops.models, function(stop) {
            if (!_.isUndefined(stop.getAssetsByUsage('geo'))) {
                this.updateStopMarker(stop);
            }
        }, this);

        if (TapAPI.geoLocation.latestLocation !== null) {
            this.onLocationFound(TapAPI.geoLocation.latestLocation);
        }
        this.listenTo(Backbone, 'geolocation.location.recieved', this.onLocationFound);
    },
    generateBubbleContent: function(stop, formattedDistance) {
        if (formattedDistance === undefined) {
            if (stop.get('distance')) {
                formattedDistance = TapAPI.geoLocation.formatDistance(stop.get('distance'));
            }
        }
        if (TapAPI.navigationControllers.StopListView.filterBy === 'stopGroup') {
            // retrieve all stops that are stop groups
            this.stops = _.filter(TapAPI.tourStops.models, function(stop) {
                return stop.get('view') === 'stop_group';
            });
        } else {
            // retrieve all stops that have a code associated with it
            this.stops = _.filter(TapAPI.tourStops.models, function(stop) {
                return stop.get('propertySet').where({'name': 'code'}) !== undefined;
            });
        }
        var template = TapAPI.templateManager.get('map-marker-bubble');
        return template({
            title: stop.get('title'),
            tourID: stop.get('tour'),
            stopID: stop.get('id'),
            distance: (formattedDistance === undefined) ? '' : 'Distance: ' + formattedDistance,
            stopLat: stop.get('location').lat,
            stopLong: stop.get('location').lng,
            showDirections: TapAPI.navigationControllers.MapView.showDirections,
            route: stop.getRoute()
        });
    },
    // Plot a single tour stop marker on the map
    // @note Assumes that the context is set to { stop: (StopModel), map_view: (MapView) }
    plotTourStopMarker: function(stop) {
        // Find the geo assets for this stop
        var geoAssets = stop.getAssetsByUsage('geo');
        if (_.isUndefined(geoAssets)) return;

        // Parse the contents of the first geo asset
        var content = geoAssets[0].get('content');
        if (_.isUndefined(content)) return;
        var data = $.parseJSON(content.at(0).get('data'));

        if (data.type == 'Point') {
            var stopIcon = L.icon({
                iconUrl: 'images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                iconRetinaUrl: 'images/marker-icon@2x.png',
                shadowUrl: 'images/marker-shadow.png',
                shadowSize: [41, 41],
                popupAnchor: [0, -100],
                className: 'stop-icon ' + stop.id
            });

            var markerLocation = new L.LatLng(data.coordinates[1], data.coordinates[0]);
            var marker = new L.Marker(markerLocation, {icon: stopIcon});

            var popup = new L.Popup({
                maxWidth: 300,
                minWidth: 200,
                closeButton: false
            });
            popup.setLatLng(markerLocation);
            popup.setContent(this.generateBubbleContent(stop));
            this.stopPopups[stop.id] = popup;

            //marker.bindPopup(popup);

            marker.stop_id = stop.id;
            marker.addEventListener('click', this.onMarkerSelected, this);

            this.stopMarkers[stop.id] = marker;
            this.map.addLayer(marker);

        }

        // Update the marker bubble when the distance to a stop changes
        stop.on('change:distance', this.updateStopMarker, this);
    },
    updateStopMarker: function(stop) {
        var formattedDistance;

        if (stop.get('distance')) {
            formattedDistance = TapAPI.geoLocation.formatDistance(stop.get('distance'));
        }

        this.stopPopups[stop.id].setContent(this.generateBubbleContent(stop), formattedDistance);
    },
    // When a marker is selected, show the popup
    // Assumes that the context is set to (MapView)
    onMarkerSelected: function(e) {
        TapAPI.tracker.trackEvent('Map', 'marker_tapped', e.target.stop_id, null);

        this.map.openPopup(this.stopPopups[e.target.stop_id]);

        $('.marker-bubble-content .directions a').on('click', function() {
            TapAPI.tracker.trackEvent('Map', 'get_directions', e.target.stop_id, null);
        });
    },
    onLocationFound: function(position) {
        var latlong = new L.LatLng(position.coords.latitude, position.coords.longitude);

        if (this.positionMarker === null) {
            var stopIcon = L.icon({
                iconUrl: 'images/marker-person.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                shadowUrl: 'images/marker-shadow.png',
                shadowSize: [41, 41],
                popupAnchor: [0, -22],
                className: 'stop-icon ' + stop.id
            });
            this.positionMarker = new L.Marker(latlong, {icon: stopIcon})
                .bindPopup('You are here',{
                closeButton: false
            });
            this.map.addLayer(this.positionMarker);

            this.positionMarker.addEventListener('click', function() {
                TapAPI.tracker.trackEvent('_trackEvent', 'Map', 'you_are_here_clicked', null);
            });
        } else {
            this.positionMarker.setLatLng(latlong);
        }
    },
    onLocationError: function(e) {
        console.log('onLocationError', e);
    },
    resizeMapViewport: function(e) {
        var footer, header, viewport;

        viewport = $('html').height();
        header = $('#header').outerHeight();
        footer = $('#footer').outerHeight();

        $('#content-wrapper').height(viewport - header - footer);

        if (e.data.context.map !== null) {
            e.data.context.map.invalidateSize();
        }
        window.scroll(0, 0);
    },
    onClose: function() {
        // stop location services
        TapAPI.geoLocation.stopLocating();

        // remove event handlers
        $(':jqmData(role="page")').off('pageinit', this.resizeMapViewport);
        $(window).off('orientationchange resize', this.resizeMapViewport);

        $('#content-wrapper').removeAttr('style');
    }
});