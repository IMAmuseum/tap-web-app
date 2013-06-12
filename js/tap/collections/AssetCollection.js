/*
 * Backbone Colleciton for managing assets for a tour
 */
TapApi.classes.collections.assetCollection = Backbone.Collection.extend({
    model: AssetModel,
    initialize: function(models, id) {
        this.localStorage = new Backbone.LocalStorage(id + '-asset');
    }
});