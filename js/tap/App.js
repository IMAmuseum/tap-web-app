define([
    'jquery',
    'backbone',
    'tap/router',
    'tap/collections/TourCollection'
], function($, Backbone, Router, TourCollection){
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
        gaq: [],
        router: undefined,
        initialize: function(config) {
            Backbone.trigger('tap.init.start');

            // get browser language
            var browserLanguage = (navigator.language) ? navigator.language : navigator.userLanguage;
            this.tap.language = browserLanguage.split('-')[0];

            // create new instance of tour collection
            this.tap.tours = new TourCollection();

            this.tap.tours.fetch();

            // load tourML
            var tourML = xmlToJson(loadXMLDoc(tap.url));
            var i, len;
            if(tourML.tour) { // Single tour
                this.initModels(tourML.tour);
            } else if(tourML.tourSet && tourML.tourSet.tourRef) { // TourSet w/ external tours
                len = tourML.tourSet.tourRef.length;
                for(i = 0; i < len; i++) {
                    var data = xmlToJson(loadXMLDoc(tourML.tourSet.tourRef[i].uri));
                    this.initModels(data.tour);
                }
            } else if(tourML.tourSet && tourML.tourSet.tour) { // TourSet w/ tours as children elements
                len = tourML.tourSet.tour.length;
                for(i = 0; i < len; i++) {
                    this.initModels(tourML.tourSet.tour[i]);
                }
            }
            // trigger tap init end event
            Backbone.trigger('tap.init.end');

            // initialize router
            this.router = new Router();
        }
    };
});