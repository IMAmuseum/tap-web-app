/*
 * Backbone view for Navigation Views to extend from
 * This is used to manage the state of the tab bar
 * All Navigation Views should extend from thie View
 */
TapAPI.classes.views.stopSelectionView = TapAPI.classes.views.baseView.extend({
    initialize: function() {
        this._super('initialize');
        this.activeToolbarButton = '';
    }
});