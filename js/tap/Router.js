/*
 * The Primary router for TAP
 */
TapAPI.classes.routers.Default = Backbone.Router.extend({
    routes: {
        '': 'tourSelection',
        'tour/:tourID/details': 'tourDetails',
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
            this.changePage(new TapAPI.classes.views.TourListView());
        }
    },
    /**
     * Route to the tour details
     * @param id The id of the tour
     */
    tourDetails: function(tourID) {
        TapAPI.tours.selectTour(tourID);
        TapAPI.currentStop = null;

        this.changePage(new TapAPI.classes.views.TourDetailsView());
    },
    routeToController: function(tourID, view) {
        var that = this;

        TapAPI.tours.selectTour(tourID);
        TapAPI.currentStop = null;

        that.changePage(new TapAPI.classes.views[view]());
    },
    /**
     * Route to a stop
     */
    tourStop: function(tourID, stopID) {
        var that = this;

        TapAPI.tours.selectTour(tourID);
        TapAPI.currentStop = TapAPI.tourStops.get(stopID);

        var stopType = TapAPI.currentStop.get('view');
        var viewName = TapAPI.viewRegistry[stopType].view;

        that.changePage(new TapAPI.classes.views[viewName]({model: TapAPI.currentStop}));
    },
    changePage: function(view) {
        TapAPI.tracker.trackPageView('/#' + Backbone.history.getFragment());
        //_gaq.push(['_trackPageview', '/#' + Backbone.history.getFragment()]);
        Backbone.trigger('tap.router.routed', view);
        Backbone.trigger('app.widgets.refresh');
    },
    getTourDefaultRoute: function(tourId) {
        var defaultController, controller;
        var fragments = this.getFragmentParts();

        var rootStop = TapAPI.tours.get(tourId).get('rootStopRef');
        if (!_.isUndefined(rootStop)) {
            return '#' + fragments[0] '/' + tourId + '/stop/' + rootStop.id;
        }

        // get tour specific default navigation controller
        if (!_.isUndefined(TapAPI.tourSettings[tourId]) &&
            TapAPI.tourSettings[tourId].defaultNavigationController) {
            defaultController = TapAPI.tourSettings[tourId].defaultNavigationController;
        }

        // get first controller if none were selected as a default
        if (_.isUndefined(defaultController)) {
            for (controller in TapAPI.navigationControllers) {
                defaultController = controller;
                break;
            }
        }

        return '#' + fragments[0] '/' + tourId + '/controller/' + defaultController;
    },
    getStopRoute: function(tourId, stopId) {
        var fragments = this.getFragmentParts();
        return '#' + fragments[0] + '/' + tourId + '/stop/' + stopId;
    },
    getFragmentParts: function() {
        return Backbone.history.fragment.split("/");
    }
});