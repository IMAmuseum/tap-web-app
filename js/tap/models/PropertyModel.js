/*
 * Backbone Model for storing a TourML Property
 */
TapAPI.classes.models.PropertyModel = Backbone.Model.extend({
    defaults: {
        'name': undefined,
        'value': undefined,
        'lang': undefined
    }
});