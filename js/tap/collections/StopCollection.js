/*
 * Backbone collection for managing Stops for a tour
 */
TapAPI.classes.collections.StopCollection = Backbone.Collection.extend({
    model: TapAPI.classes.models.StopModel,
    initialize: function(models, id) {
        this.localStorage = new Backbone.LocalStorage(id + '-stop');
        this.tourId = id;
    },
    // retrieve the stop id of a given key code
    getStopByKeycode: function(key) {
        for(var i = 0; i < this.models.length; i++) {
            var code = this.models[i].get('propertySet').where({'name':'code', 'value':key});
            if (code.length) {
                return this.models[i];
            }
        }
        return undefined;
    }
});