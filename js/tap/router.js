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
            '': 'tourSelection',
            'tour/:tourID/details': 'tourDetails',
            'tour/:tourID/keypad': 'keypad',
            'tour/:tourID/stop-list': 'tourStopList',
            'tour/:tourID/map': 'map',
            'tour/:tourID/stop/:stopID': 'tourStop'
        },
        /**
         * Route to the tour listing
         */
        tourSelection: function() {
            this.changePage(new TourListView());
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
        keypad: function(tourID) {
            TapAPI.tours.selectTour(tourID);
            this.changePage(new KeypadView());
        },
        /**
         * Route to the tour list
         * @param id The id of the tour
         */
        tourStopList: function(tourID) {
            TapAPI.tours.selectTour(tourID);
            this.changePage(new StopListView());
        },
        /**
         * Route to the tour map
         * Certain parameters are determined here in the router to leave open the possibility of
         * plotting markers for several tours on the same map
         */
        map: function(tourID) {
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
        /**
         * Route to a stop
         */
        tourStop: function(tourID, stopID) {
            var that = this;

            TapAPI.tours.selectTour(tourID);
            TapAPI.currentStop = TapAPI.tourStops.get(stopID);

            var stopType = TapAPI.currentStop.get('view');
            var viewPath = 'tap/views/' + TapAPI.config.viewRegistry[stopType].view;

            Require([viewPath], function(View) {
                that.changePage(new View({model: TapAPI.currentStop}));
            });
        },
        changePage: function(view) {
            Backbone.trigger('tap.router.routed', view);
            $('body').trigger('pagecreate');
        }
    });
    return new router();
});