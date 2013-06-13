/*
 * Backbone View for Initializing and Starting the TAP Web App
 */
TapAPI.classes.views.appView = Backbone.View.extend({
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
        this.$el.append(popupView.render().$el);

        if (TapAPI.social.enabled) {
            var socialPopupView = new SocialPopupView();
            this.$el.append(socialPopupView.render().$el);
        }

        // trigger jquery mobile to initialize new widgets
        Backbone.trigger('app.widgets.refresh');
    },
    runApp: function() {
        Backbone.trigger('tap.app.loading');
        // get browser language
        var browserLanguage = (navigator.language) ? navigator.language : navigator.userLanguage;
        TapAPI.language = browserLanguage.split('-')[0];

        // initialize GA
        window._gaq = window._gaq || [];
        window._gaq.push(["_setAccount", TapAPI.trackerID]);
        (function(d,t){
            var g = d.createElement(t),
                s = d.getElementsByTagName(t)[0];
            g.async = 1;
            g.src= ('https:' == location.protocol ? '//ssl' : '//www') + '.google-analytics.com/ga.js';
            s.parentNode.insertBefore(g, s);
        }(document, 'script'));

        // create new instance of tour collection
        TapAPI.tours = new TapAPI.classes.collections.tourCollection();
        TapAPI.tours.syncTourML(TapAPI.tourMLEndpoint);

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