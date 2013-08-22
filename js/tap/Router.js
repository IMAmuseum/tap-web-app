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
        if (_.isUndefined(TapAPI.currentTour)) {
            Backbone.on("tap.tour.loaded." + tourID, this.tourDetails, this);
            return;
        } else {
            Backbone.off("tap.tour.loaded." + tourID);
        }
        TapAPI.currentStop = null;

        this.changePage(new TapAPI.classes.views.TourDetailsView());
    },
    routeToController: function(tourID, view) {
        var that = this;

        TapAPI.tours.selectTour(tourID);
        if (_.isUndefined(TapAPI.currentTour)) {
            Backbone.on("tap.tour.loaded." + tourID, this.routeToController, this);
            return;
        } else {
            Backbone.off("tap.tour.loaded." + tourID);
        }

        if (_.isUndefined(view)) {
            var parts = Backbone.history.getFragment().split("/");
            view = parts[parts.length - 1];
        }

        TapAPI.currentStop = null;

        that.changePage(new TapAPI.classes.views[view]());
    },
    /**
     * Route to a stop
     */
    tourStop: function(tourID, stopID) {
        var that = this;

        TapAPI.tours.selectTour(tourID);

        if (_.isUndefined(TapAPI.currentTour)) {
            Backbone.on("tap.tour.loaded." + tourID, this.tourStop, this);
            return;
        } else {
            Backbone.off("tap.tour.loaded." + tourID);
        }

        if (_.isUndefined(stopID)) {
            var parts = Backbone.history.getFragment().split("/");
            stopID = parts[parts.length - 1];
        }

        TapAPI.currentStop = TapAPI.tourStops.get(stopID);

        var stopType = TapAPI.currentStop.get('view');
        var viewName = TapAPI.viewRegistry[stopType].view;

        that.changePage(new TapAPI.classes.views[viewName]({model: TapAPI.currentStop}));
    },
    changePage: function(view) {
        TapAPI.tracker.trackPageView('/#' + Backbone.history.getFragment());
        //_gaq.push(['_trackPageview', '/#' + Backbone.history.getFragment()]);
        window.scrollTo(0, 0);
        Backbone.trigger('tap.router.routed', view);
        Backbone.trigger('app.widgets.refresh');
    },
    getTourDefaultRoute: function(tourId) {
        var defaultController, controller;
        var baseRoute = this.getBaseRoute();

        var rootStop = TapAPI.tours.get(tourId).get('rootStopRef');
        if (!_.isUndefined(rootStop)) {
            return '#' + baseRoute + '/' + tourId + '/stop/' + rootStop.id;
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

        return '#' + baseRoute + '/' + tourId + '/controller/' + defaultController;
    },
    getStopRoute: function(tourId, stopId, withHash) {
        if (_.isUndefined(withHash) || withHash === true) {
            withHash = '#';
        } else {
            withHash = '';
        }
        var baseRoute = this.getBaseRoute();
        return withHash + baseRoute + '/' + tourId + '/stop/' + stopId;
    },
    getFragmentParts: function() {
        return Backbone.history.fragment.split("/");
    },
    getBaseRoute: function() {
        var parts = this.getFragmentParts();
        if (parts[0].length === 0) {
            return 'tour';
        }
        return parts[0];
    },
    getControllerRoute: function(tourId, viewName, withHash) {
        if (_.isUndefined(withHash) || withHash === true) {
            withHash = '#';
        } else {
            withHash = '';
        }
        var baseRoute = this.getBaseRoute();
        return withHash + baseRoute + '/' + tourId + '/controller/' + viewName;
    }
});