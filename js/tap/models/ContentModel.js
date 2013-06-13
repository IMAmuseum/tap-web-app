/*
 * Backbone Model for storing a TourML Asset content element
 */
TapAPI.classes.models.ContentModel = Backbone.Model.extend({
    initialize: function() {
        //parse never gets called due to this not being in localstorage as its own record
        this.set('propertySet', new TapAPI.classes.collections.PropertySetCollection(
            this.get('propertySet'),
            {id: this.id}
        ));

        if (this.get('data').value) {
            this.set('data', this.get('data').value);
        }
    },
    getAsset: function() {
        return this.collection.asset;
    },
    save: function() {
        this.collection.asset.save();
    },
    defaults: {
        'lang': undefined,
        'propertySet': undefined,
        'data': undefined,
        'format': undefined,
        'lastModified': undefined,
        'part': undefined
    }
});