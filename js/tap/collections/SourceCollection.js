/*
 * Backbone collection for managing TourML Asset sources
 */
TapAPI.classes.collections.sourceCollection = Backbone.Collection.extend({
    model: TapAPI.classes.models.SourceModel,
    initialize: function(models, options) {
        this.localStorage = new Backbone.LocalStorage(options.id + '-source');
        this.asset = options.asset;
    }
});