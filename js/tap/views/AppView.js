define([
    'jquery',
    'underscore',
    'backbone',
    'tap/TapAPI',
    'tap/TemplateManager',
    'tap/collections/TourCollection',
    'tap/views/HeaderView',
    'tap/views/ContentView',
    'tap/views/FooterView',
    'tap/views/PopupView'
], function($, _, Backbone, TapAPI, TemplateManager, TourCollection, HeaderView, ContentView, FooterView, PopupView) {
    var appView = Backbone.View.extend({
        id: 'page-wrapper',
        initialize: function() {
            this.listenTo(Backbone, 'app.widgets.refresh', this.refreshWidgets);
        },
        render: function() {
            $(':jqmData(role="page")').append(this.el);
            // add navigation bar
            var headerView = new HeaderView();
            this.$el.append(headerView.$el);

            // add content view
            var contentView = new ContentView();
            this.$el.append(contentView.$el);

            // add footer bar
            var footerView = new FooterView();
            this.$el.append(footerView.$el);

            // add dialog view
            var popupView = new PopupView();
            this.$el.append(popupView.$el);

            // trigger jquery mobile to initialize new widgets
            Backbone.trigger('app.widgets.refresh');
        },
        runApp: function() {
            Backbone.trigger('tap.app.loading');
            // get browser language
            var browserLanguage = (navigator.language) ? navigator.language : navigator.userLanguage;
            TapAPI.language = browserLanguage.split('-')[0];

            // initialize GA if trackerID is available
            if (TapAPI.config.trackerID) {
                window._gaq = window._gaq || [];
                window._gaq.push(["_setAccount", TapAPI.config.trackerID]);
                (function(d,t){
                    var g = d.createElement(t),
                        s = d.getElementsByTagName(t)[0];
                    g.async = 1;
                    g.src= ('https:' == location.protocol ? '//ssl' : '//www') + '.google-analytics.com/ga.js';
                    s.parentNode.insertBefore(g, s);
                }(document, 'script'));
            }

            // create new instance of tour collection
            TapAPI.tours = new TourCollection();
            TapAPI.tours.syncTourML(TapAPI.config.url);

            // trigger tap init end event
            Backbone.trigger('tap.app.complete');

            this.render();

            // start backbone history collection
            Backbone.history.start();
        },
        refreshWidgets: function() {
            $(':jqmData(role="page")').page('destroy').page();
            $.mobile.resetActivePageHeight();
        }
    });
    return new appView();
});