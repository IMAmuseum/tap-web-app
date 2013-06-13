/*
 * Backbone View for displaying the footer tab bar
 */
TapAPI.classes.views.footerView = Backbone.view.extend({
    id: 'footer',
    attributes: {
        'data-role': 'footer',
        'data-position': 'fixed',
        'data-tap-toggle': 'false'
    },
    template: TemplateManager.get('footer'),
    initialize: function() {
        this.listenTo(Backbone, 'tap.router.routed', this.render);
    },
    render: function(view) {
        if (!_.isUndefined(TapAPI.currentTour) && view.displayFooter) {
            var controllers;
            if (!_.isUndefined(TapAPI.tourSettings[TapAPI.currentTour]) &&
                TapAPI.tourSettings[TapAPI.currentTour].enabledNavigationControllers) {
                controllers = _.pick(TapAPI.navigationControllers, TapAPI.tourSettings[TapAPI.currentTour].enabledNavigationControllers);
            } else {
                controllers = TapAPI.navigationControllers;
            }

            this.$el.show();
            this.$el.html(this.template({
                activeToolbarButton: view.activeToolbarButton,
                tourID: TapAPI.currentTour,
                controllers: controllers
            }));
        } else {
            this.$el.hide();
        }
        return this;
    }
});