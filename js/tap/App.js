define([
    'jquery',
    'backbone',
    'tap/router'
], function($, Backbone, Router){
    var router;
    return {
        tap: {
            tours: {},
            tourAssets: {},
            tourStops: {},
            language: 'en',
            defaultLanguage: 'en',
            currentStop: '',
            currentTour: ''
        },
        router: undefined,
        initialize: function() {
            this.router = new Router();
        }
    };
});