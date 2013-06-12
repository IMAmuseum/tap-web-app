/*
 * Backbone collection for managing TourML Asset sources
 */
TapApi.classes.collections.sourceCollection = Backbone.Collection.extend({
    model: SourceModel,
    initialize: function(models, options) {
        this.localStorage = new Backbone.LocalStorage(options.id + '-source');
        this.asset = options.asset;
    }
});