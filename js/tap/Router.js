define([
    'jquery',
    'underscore',
    'require',
    'backbone',
    'tap/TapAPI',
    'tap/views/ContentView',
    'tap/views/TourListView',
    'tap/views/TourDetailsView'
], function($, _, Require, Backbone, TapAPI, ContentView, TourListView, TourDetailsView) {
    var router = Backbone.Router.extend({
        routes: {
            '': 'tourSelection',
            'tour/:tourID/details': 'tourDetails',
            // 'tour/:tourID/keypad': 'keypad',
            // 'tour/:tourID/stop-list': 'tourStopList',
            // 'tour/:tourID/map': 'map',
            'tour/:tourID/stop/:stopID': 'tourStop'
        },
        initialize: function() {
            _.each(TapAPI.navigationControllers, function(controller) {
                this.route('tour/:tourID/controller/:view', 'routeToController');
            }, this);
        },
        /**
         * Route to the tour listing
         */
        tourSelection: function() {
            // check to see if only one tour exists
            if (TapAPI.tours.length === 1) {
                // navigate them directly to that tours details page
                this.navigate('tour/' + TapAPI.tours.at(0).get('id') + '/details', {trigger: true});
            } else {
                this.changePage(new TourListView());
            }
        },
        /**
         * Route to the tour details
         * @param id The id of the tour
         */
        tourDetails: function(tourID) {
            TapAPI.tours.selectTour(tourID);
            this.changePage(new TourDetailsView());
        },
        routeToController: function(tourID, view) {
            var that = this;
            TapAPI.tours.selectTour(tourID);

            var viewPath = 'tap/views/' + view;
            Require([viewPath], function(view) {
                that.changePage(new view());
            });
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
            _gaq.push(['_trackPageview', '/#' + Backbone.history.getFragment()]);

            Backbone.trigger('tap.router.routed', view);
            Backbone.trigger('app.widgets.refresh');
        }
    });
    return new router();
});