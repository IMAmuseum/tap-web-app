define([
    'jquery',
    'underscore',
    'backbone',
    'tap/router',
    'tap/settings',
    'tap/collections/TourCollection'
], function($, _, Backbone, Router, Settings, TourCollection) {
    var appView = Backbone.View.extend({
        initialize: function() {
            this.gaq = [];
            this.router = undefined;
            this.tap = {
                tours: {},
                tourAssets: {},
                tourStops: {},
                language: 'es',
                defaultLanguage: 'en',
                currentStop: '',
                currentTour: '',
                collections: {},
                models: {},
                views: {}
            };
            this.settings = _.defaults(Settings, {
                url: '',
                trackerID: '',
                tourSettings: {}
            });

            this.listenTo(Backbone, 'tap.app.initialized', this.runApp);
            Backbone.trigger('tap.app.initialized');
        },
        render: function() {

        },
        runApp: function() {
            Backbone.trigger('tap.app.loading');
            // get browser language
            var browserLanguage = (navigator.language) ? navigator.language : navigator.userLanguage;
            this.tap.language = browserLanguage.split('-')[0];

            // initialize GA if trackerID is available
            if (this.settings.trackerID) {
                this.gaq.push(["_setAccount", this.settings.trackerID]);
                (function(d,t){
                    var g = d.createElement(t),
                        s = d.getElementsByTagName(t)[0];
                    g.async = 1;
                    g.src= ('https:' == location.protocol ? '//ssl' : '//www') + '.google-analytics.com/ga.js';
                    s.parentNode.insertBefore(g, s);
                }(document, 'script'));
            }

            // create new instance of tour collection
            this.tap.tours = new TourCollection();
            this.tap.tours.syncTourML(this.settings.url);

            // trigger tap init end event
            Backbone.trigger('tap.app.complete');

            // initialize router
           this.router = new Router();
           this.render();
        }
    });
    return new appView();
});