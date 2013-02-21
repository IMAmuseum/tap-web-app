define([
    'jquery',
    'underscore',
    'backbone',
    'tap/TapAPI',
    'tap/TemplateManager',
    'tap/views/BaseView',
    'tap/GeoLocation',
    'leaflet'
], function($, _, Backbone, TapAPI, TemplateManager, BaseView, GeoLocation) {
    var mapView = BaseView.extend({
        id: 'tour-map',
        initialize: function() {
            this._super('initialize');

            this.title = 'This is a map';
            this.map = null;
            this.mapOptions = {
                'initialLat': null,
                'initialLong': null,
                'initialZoom': 2
            };
            this.stopMarkers = {};
            this.stopIcons = {};
            this.stopPopups = {};
            this.positionMarker = null;

            this.geoLocation = new GeoLocation();

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


            $(':jqmData(role="page")').on('pageinit', this.resizeMapViewport(this));
            $(window).on('orientationchange resize', this.resizeMapViewport(this));
        },
        render: function() {
            return this;
        },
        finishedAddingContent: function() {
            // initialize geo location
            this.geoLocation.startLocating();

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

            if (this.geoLocation.latestLocation !== null) {
                this.onLocationFound(this.geoLocation.latestLocation);
            }
            this.listenTo(Backbone, 'geolocation.location.recieved', this.onLocationFound);

            // _.delay(function() {
            //     that.map.invalidateSize();
            // }, 1000);
        },
        generateBubbleContent: function(stop, formattedDistance) {
            if (formattedDistance === undefined) {
                if (stop.get('distance')) {
                    formattedDistance = this.geoLocation.formatDistance(stop.get('distance'));
                }
            }

            var template = TemplateManager.get('tour-map-marker-bubble');
            return template({
                'title': stop.get('title'),
                'tour_id': stop.get('tour'),
                'stop_id': stop.get('id'),
                'distance': (formattedDistance === undefined) ? '' : 'Distance: ' + formattedDistance,
                'stop_lat': stop.get('location').lat,
                'stop_lon': stop.get('location').lng
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
                var stopIcon = L.divIcon({
                    className: 'stop-icon ' + stop.id
                });

                var markerLocation = new L.LatLng(data.coordinates[1], data.coordinates[0]);
                var marker = new L.Marker(markerLocation, {icon: stopIcon});

                var popup = new L.Popup();
                popup.setLatLng(markerLocation);
                popup.setContent(this.generateBubbleContent(stop));
                this.stopPopups[stop.id] = popup;

                marker.stop_id = stop.id;
                marker.addEventListener('click', this.onMarkerSelected, this);

                this.stopIcons[stop.id] = stopIcon;
                this.stopMarkers[stop.id] = marker;
                this.map.addLayer(marker);

            }

            // Update the marker bubble when the distance to a stop changes
            stop.on('change:distance', this.updateStopMarker, this);
        },
        updateStopMarker: function(stop) {
            var formatted_distance;

            if (stop.get('distance')) {
                formatted_distance = this.geoLocation.formatDistance(stop.get('distance'));
            }

            this.stopPopups[stop.id].setContent(this.generateBubbleContent(stop), formatted_distance);

            // Update the stop icon
            var distance_label = $('.stop-icon.' + stop.id + ' .distance-label');

            if (distance_label.length === 0) {
                template = TemplateManager.get('tour-map-distance-label');
                $('.stop-icon.' + stop.id).append(template({
                    distance: formatted_distance
                }));
            } else {
                distance_label.html(formatted_distance);
            }

        },
        // When a marker is selected, show the popup
        // Assumes that the context is set to (MapView)
        onMarkerSelected: function(e) {
            _gaq.push(['_trackEvent', 'Map', 'marker_clicked', e.target.stop_id]);

            this.map.openPopup(this.stopPopups[e.target.stop_id]);

            $('.marker-bubble-content .directions a').on('click', function() {
                _gaq.push(['_trackEvent', 'Map', 'get_directions', e.target.stop_id]);
            });

        },
        onLocationFound: function(position) {
            var latlong = new L.LatLng(position.coords.latitude, position.coords.longitude);

            if (this.positionMarker === null) {
                this.positionMarker = new L.Marker(latlong)
                    .bindPopup('You are here');
                this.map.addLayer(this.positionMarker);

                this.positionMarker.addEventListener('click', function() {
                    _gaq.push(['_trackEvent', 'Map', 'you_are_here_clicked']);
                });

            } else {
                this.positionMarker.setLatLng(latlong);
            }
        },
        onLocationError: function(e) {
            console.log('onLocationError', e);
        },
        resizeMapViewport: function(that) {
            var footer, header, viewport;

            viewport = $('html').height();
            header = $('#header').outerHeight();
            footer = $('#footer').outerHeight();

            $('#content-wrapper').height(viewport - header - footer);

            if (that.map !== null) {
                that.map.invalidateSize();
            }
            window.scroll(0, 0);
        },
        onClose: function() {
            // stop location services
            this.geoLocation.stopLocating();

            // set the default height back
            $('#content-wrapper').height('auto');
            // remove event handlers
            $(':jqmData(role="page")').off('pageinit', this.resizeMapViewport);
            $(window).off('orientationchange resize', this.resizeMapViewport);
        }
    });
    return mapView;
});