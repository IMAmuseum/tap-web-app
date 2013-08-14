/*
 * Backbone view for Navigation Views to extend from
 * This is used to manage the state of the tab bar
 * All Navigation Views should extend from thie View
 */
TapAPI.classes.views.StopSelectionView = TapAPI.classes.views.BaseView.extend({
    initialize: function(options) {
        this._super(options);
        this.activeToolbarButton = '';
    },
    getRoute: function(withHash) {
        return TapAPI.router.getControllerRoute(TapAPI.currentTour, this.activeToolbarButton, withHash);
    }
});