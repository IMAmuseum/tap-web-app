/*
 * Backbone View for displaying the Stop List Navigation
 */
TapAPI.classes.views.StopListView = TapAPI.classes.views.StopSelectionView.extend({
    id: 'tour-stop-list',
    template: TapAPI.templateManager.get('stop-list'),
    initialize: function(options) {
        this._super(options);
        this.title = 'Select a Stop';
        this.activeToolbarButton = 'StopListView';
        this.filterBy = TapAPI.navigationControllers.StopListView.filterBy;
        if (!_.isUndefined(options) && options.filterBy) {
            this.filterBy = options.filterBy;
        }
        this.sortBy = TapAPI.navigationControllers.StopListView.sortBy;
        if (!_.isUndefined(options) && options.sortBy) {
            this.filterBy = options.sortBy;
        }
        this.displayCodes = TapAPI.navigationControllers.StopListView.displayCodes;
        this.displayThumbnails = TapAPI.navigationControllers.StopListView.displayThumbnails;

        // apply filter
        switch (this.filterBy) {
            case 'stopGroup':
                // retrieve all stops that are stop groups
                this.stops = _.filter(TapAPI.tourStops.models, function(stop) {
                    return stop.get('view') === 'stop_group';
                });
                break;

            case 'code':
                // retrieve all stops that have a code associated with it
                this.stops = _.filter(TapAPI.tourStops.models, function(stop) {
                    var code = parseInt(stop.getProperty('code'), 10);
                    if (isNaN(code)) {
                        return false;
                    } else {
                        return true;
                    }
                });
                break;

            default:
                this.stops = TapAPI.tourStops.models;
        }

        // apply sorting
        if (this.sortBy === 'title') {
            // sort by title
            this.stops = _.sortBy(this.stops, function(stop) {
                return stop.get('title');
            });
        } else {
            // sort by their key code
            this.stops = _.sortBy(this.stops, function(stop) {
                return parseInt(stop.getProperty('code'), 10);
            });
        }

        var stops = [];
        _.each(this.stops, function(stop) {
            stops.push({
                model: stop,
                title: this.getStopTitle(stop),
                icon: this.getStopIcon(stop),
                thumbnail: this.getStopThumbnail(stop)
            });
        }, this);

        this.stops = stops;
    },
    render: function() {
        this.$el.html(this.template({
            tourID: TapAPI.currentTour,
            stops: this.stops,
            displayCodes: this.displayCodes,
            displayThumbnails: this.displayThumbnails
        }));
        return this;
    },
    getStopTitle: function(stop) {
        return stop.get('title');
    },
    getStopIcon: function(stop) {
        var stopConfig = TapAPI.viewRegistry[stop.get('view')];
        var icon;
        if (stopConfig) {
            icon = stopConfig.icon;
        }
        return icon;
    },
    getStopThumbnail: function(stop) {
        return undefined;
    }
});