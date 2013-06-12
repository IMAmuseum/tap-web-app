/*
 * Backbone view for Navigation Views to extend from
 * This is used to manage the state of the tab bar
 * All Navigation Views should extend from thie View
 */
TapApi.classes.views.stopSelectionView = TapApi.classes.views.baseView.extend({
    initialize: function() {
        this._super('initialize');
        this.activeToolbarButton = '';
    }
});