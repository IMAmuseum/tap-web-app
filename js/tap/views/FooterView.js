/*
 * Backbone View for displaying the footer tab bar
 */
TapAPI.classes.views.FooterView = Backbone.View.extend({
    id: 'footer',
    attributes: {
        'data-role': 'footer',
        'data-position': 'fixed',
        'data-tap-toggle': 'false'
    },
    template: TapAPI.templateManager.get('footer'),
    events: {
        'click a': 'clickTrack'
    },
    initialize: function() {
        this.listenTo(Backbone, 'tap.router.routed', this.render);
    },
    render: function(view) {
        if (!_.isUndefined(TapAPI.currentTour) && view.displayFooter) {
            var controllers;
            if (!_.isUndefined(TapAPI.tourSettings[TapAPI.currentTour]) &&
                TapAPI.tourSettings[TapAPI.currentTour].enabledNavigationControllers) {
                controllers = _.pick(TapAPI.navigationControllers, TapAPI.tourSettings[TapAPI.currentTour].enabledNavigationControllers);
            } else if (!_.isUndefined(TapAPI.tourSettings['default']) &&
                TapAPI.tourSettings['default'].enabledNavigationControllers) {
                controllers = _.pick(TapAPI.navigationControllers, TapAPI.tourSettings['default'].enabledNavigationControllers);
            } else {
                controllers = TapAPI.navigationControllers;
            }

            this.$el.show();
            this.$el.html(this.template({
                activeToolbarButton: view.activeToolbarButton,
                tourID: TapAPI.currentTour,
                controllers: controllers,
                baseRoute: TapAPI.router.getBaseRoute()
            }));
        } else {
            this.$el.hide();
        }
        return this;
    },
    clickTrack: function(e) {
        var item = $(e.currentTarget).find("span.ui-btn-text").text();
        TapAPI.tracker.trackEvent('Navigation', 'tapped', item, null);
    }
});