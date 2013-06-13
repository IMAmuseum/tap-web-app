/*
 * Backbone Colleciton for managing assets for a tour
 */
TapAPI.classes.collections.AssetCollection = Backbone.Collection.extend({
    model: TapAPI.classes.models.AssetModel,
    initialize: function(models, id) {
        this.localStorage = new Backbone.LocalStorage(id + '-asset');
    }
});