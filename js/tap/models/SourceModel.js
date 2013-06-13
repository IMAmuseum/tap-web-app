/*
 * Backbone model for storing a TourML Asset Source
 */
TapAPI.classes.models.sourceModel = Backbone.Model.extend({
    initialize: function() {
        //parse never gets called due to this not being in localstorage as its own record
        this.set('propertySet', new PropertySetCollection(
            this.get('propertySet'),
            {id: this.id}
        ));
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
        'uri': undefined,
        'format': undefined,
        'lastModified': undefined,
        'part': undefined
    }
});