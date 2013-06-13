/*
 * Backbone collection for managing TourML Asset Content
 */
TapAPI.classes.collections.contentCollection = Backbone.Collection.extend({
    model: TapAPI.classes.models.ContentModel,
    initialize: function(models, options) {
        this.localStorage = new Backbone.LocalStorage(options.id + '-source');
        this.asset = options.asset;
    }
});