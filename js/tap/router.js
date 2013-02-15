define([
    'jquery',
    'underscore',
    'require',
    'backbone',
    'tap/TapAPI',
    'tap/views/ContentView',
    'tap/views/TourListView',
    'tap/views/TourDetailsView',
    'tap/views/KeypadView',
    'tap/views/StopListView',
    'tap/views/MapView'
], function($, _, Require, Backbone, TapAPI, ContentView, TourListView, TourDetailsView, KeypadView, StopListView, MapView) {
    var router = Backbone.Router.extend({
        routes: {
            '': 'list',
            'map': 'map',
            'tour/:tour_id': 'tourDetails',
            'keypad/:tour_id': 'keypad',
            'tourstop/:tour_id/:stop_id': 'tourStopById',
            'tourstop/:tour_id/code/:stop_code': 'tourStopByCode',
            'tourmap/:tour_id': 'tourMap',
            'tourstoplist/:tour_id': 'tourStopList'
        },
        initialize: function() {

        },
        /**
         * Route to the tour listing
         */
        list: function() {
            this.changePage(new TourListView());
        },
        /**
         * Route to the overall map view
         */
        map: function() {
            var map_options = {
                stops: new TapAPI.collections.Stops()
            };
            // Find all of the geolocated stops in the tour set
            _.each(TapAPI.tours.models, function(tour) {
                TapAPI.tours.selectTour(tour.id);
                _.each(TapAPI.tourStops.models, function(stop) {
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
        tourDetails: function(tourID) {
            TapAPI.tours.selectTour(tourID);
            this.changePage(new TourDetailsView());
        },
        /**
         * Route to the keypad
         * @param id The id of the tour
         */
        keypad: function(id) {
            this.changePage(new KeypadView());
        },
        /**
         * Route to a stop
         */
        tourStop: function() {
            var viewPath = TapAPI.config.viewRegistry[TapAPI.currentStop.get('view')];
            var view = Require(viewPath);
            if (view === undefined) {
                console.log('View not in registry: ', TapAPI.currentStop.get('view'));
            }

            this.changePage(new view({
                model: TapAPI.currentStop,
                title: TapAPI.tours.get(TapAPI.currentTour).get('title')[0].value
            }));
        },
        /**
         * Route to a stop by stop ID
         **/
        tourStopById: function(tour_id, stop_id) {
            // set the selected tour
            TapAPI.tours.selectTour(tour_id);
            TapAPI.currentStop = TapAPI.tourStops.get(stop_id);
            this.tourStop();
        },
        /**
         * Route to a stop by stop code
         */
        tourStopByCode: function(tour_id, stop_code) {
            // set the selected tour
            TapAPI.tours.selectTour(tour_id);
            TapAPI.currentStop = TapAPI.tourStops.getStopByKeycode(stop_code);
            this.tourStop();
        },
        /**
         * Route to the tour list
         * @param id The id of the tour
         */
        tourStopList: function(id) {
            // set the selected tour
            TapAPI.tours.selectTour(id);
            var options = {
                model: TapAPI.tours.get(TapAPI.currentTour)
            };
            if (TapAPI.config.StopListView !== undefined) {
                options = _.extend(options, TapAPI.config.StopListView);
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
            TapAPI.tours.selectTour(id);
            var map_options = {
                'stops': TapAPI.tourStops
            };

            // Look to see if a location is defined for the tour to use as the initial map center
            var tour = TapAPI.tours.get(TapAPI.currentTour);
            _.each(tour.get('appResource'), function(resource) {

                // Make sure this is a geo asset reference
                if ((resource === undefined) || (resource.usage != 'geo')) return;

                asset = TapAPI.tourAssets.get(resource.id);
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
        changePage: function(view) {
            Backbone.trigger('tap.router.routed', view);
            $('body').trigger('pagecreate');
        }
    });
    return new router();
});