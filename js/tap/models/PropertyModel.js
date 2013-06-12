/*
 * Backbone Model for storing a TourML Property
 */
TapApi.classes.models.propertyModel = Backbone.Model.extend({
    defaults: {
        'name': undefined,
        'value': undefined,
        'lang': undefined
    }
});