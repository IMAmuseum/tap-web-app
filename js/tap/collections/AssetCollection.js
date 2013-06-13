/*
 * Backbone Colleciton for managing assets for a tour
 */
TapAPI.classes.collections.assetCollection = Backbone.Collection.extend({
    model: TapAPI.classes.models.assetModel,
    initialize: function(models, id) {
        this.localStorage = new Backbone.LocalStorage(id + '-asset');
    }
});