define([
    'jquery',
    'underscore',
    'backbone',
    'tap/views/AppView'
], function($, _, Backbone, App) {
    var router = Backbone.Router.extend({
        routes: {
            '': 'list',
            'map': 'map',
            'tour/:tour_id': 'tourDetails',
            'tourkeypad/:tour_id': 'tourKeypad',
            'tourstop/:tour_id/:stop_id': 'tourStopById',
            'tourstop/:tour_id/code/:stop_code': 'tourStopByCode',
            'tourmap/:tour_id': 'tourMap',
            'tourstoplist/:tour_id': 'tourStopList'
        },
        initialize: function() {
            console.log(App);
        },
        /**
         * Route to the tour listing
         */
        list: function() {
            //this.changePage(new TourList());
        },
        /**
         * Route to the overall map view
         */
        map: function() {
            var map_options = {
                stops: new TapAPI.collections.Stops()
            };
            // Find all of the geolocated stops in the tour set
            _.each(App.tap.tours.models, function(tour) {
                App.tap.tours.selectTour(tour.id);
                _.each(App.tap.tourStops.models, function(stop) {
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
        tourDetails: function(id) {

            App.tap.tours.selectTour(id);
            this.changePage(new TapAPI.views.TourDetails({model: App.tap.tours.get(App.tap.currentTour)}));
        },
        /**
         * Route to the keypad
         * @param id The id of the tour
         */
        tourKeypad: function(id) {
            App.tap.tours.selectTour(id);
            this.changePage(new TapAPI.views.Keypad({
                model: App.tap.tours.get(App.tap.currentTour),
                page_title: "Enter a code"
            }));
        },
        /**
         * Route to a stop
         */
        tourStop: function() {
            var api_class = TapAPI.views.registry[App.tap.currentStop.get('view')];
            if (api_class === undefined) {
                console.log('View not in registry: ', App.tap.currentStop.get('view'));
                api_class = 'Stop';
            }

            this.changePage(new TapAPI.views[api_class]({
                model: App.tap.currentStop,
                page_title: App.tap.tours.get(App.tap.currentTour).get('title')[0].value
            }));
        },
        /**
         * Route to a stop by stop ID
         **/
        tourStopById: function(tour_id, stop_id) {
            // set the selected tour
            App.tap.tours.selectTour(tour_id);
            App.tap.currentStop = App.tap.tourStops.get(stop_id);
            this.tourStop();
        },
        /**
         * Route to a stop by stop code
         */
        tourStopByCode: function(tour_id, stop_code) {
            // set the selected tour
            App.tap.tours.selectTour(tour_id);
            App.tap.currentStop = App.tap.tourStops.getStopByKeycode(stop_code);
            this.tourStop();
        },
        /**
         * Route to the tour list
         * @param id The id of the tour
         */
        tourStopList: function(id) {
            // set the selected tour
            App.tap.tours.selectTour(id);
            var options = {
                model: App.tap.tours.get(App.tap.currentTour)
            };
            if (App.tap.config.StopListView !== undefined) {
                options = _.extend(options, App.tap.config.StopListView);
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
            App.tap.tours.selectTour(id);
            var map_options = {
                'stops': App.tap.tourStops
            };

            // Look to see if a location is defined for the tour to use as the initial map center
            var tour = App.tap.tours.get(App.tap.currentTour);
            _.each(tour.get('appResource'), function(resource) {

                // Make sure this is a geo asset reference
                if ((resource === undefined) || (resource.usage != 'geo')) return;

                asset = App.tap.tourAssets.get(resource.id);
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
        changePage: function(page) {
            // Close the current view to unbind events, etc.
            if (App.tap.currentView !== undefined) {
                App.tap.currentView.close();
            }

            App.tap.currentView = page;

            page.$el.attr('data-role', 'page');
            page.render();
            $('body').append(page.$el);
            var transition = $.mobile.defaultPageTransition;

            $.mobile.changePage(page.$el, {changeHash:false, transition: transition});
        }
    });
    return router;
});