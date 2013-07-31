/*
 * Backbone View for displaying a Stop group
 */
TapAPI.classes.views.StopGroupView = TapAPI.classes.views.BaseView.extend({
    id: 'stop-group',
    template: TapAPI.templateManager.get('stop-group'),
    initialize: function(options) {
        this._super(options);
    },
    render: function() {
        var stops = [],
            header;
        var description = this.model.get('description');

        var headerAsset = this.model.getAssetsByUsage('header_image');
        if (!_.isUndefined(headerAsset)) {
            header = headerAsset[0].get('source').at(0).get('uri');
        }

        _.each(this.model.get('connection'), function(connection) {
            var stop = TapAPI.tourStops.get(connection.destId);
            if (stop) {
                stops.push({
                    id: stop.get('id'),
                    title: stop.get('title'),
                    icon: TapAPI.viewRegistry[stop.get('view')].icon,
                    route: stop.getRoute()
                });
            }
        });

        this.$el.html(this.template({
            header: header,
            title: this.model.get('title'),
            tourID: TapAPI.currentTour,
            description: _.isEmpty(description) ? '' : description,
            stops: stops
        }));

        return this;
    }
});