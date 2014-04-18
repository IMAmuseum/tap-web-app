/*
 * Backbone View for Initializing and Starting the TAP Web App
 */
TapAPI.classes.views.AppView = Backbone.View.extend({
    id: 'page-wrapper',
    initialize: function() {
        this.listenTo(Backbone, 'app.widgets.refresh', this.refreshWidgets);
    },
    render: function() {
        $(':jqmData(role="page")').append(this.el);
        // add navigation bar
        var headerView = new TapAPI.classes.views.HeaderView();
        this.$el.append(headerView.$el);

        // add content view
        var contentView = new TapAPI.classes.views.ContentView();
        this.$el.append(contentView.$el);

        // add footer bar
        var footerView = new TapAPI.classes.views.FooterView();
        this.$el.append(footerView.$el);

        // add dialog view
        var popupView = new TapAPI.classes.views.PopupView();
        this.$el.append(popupView.render().$el);

        // add loader view (but don't add its element, we don't need that)
        var loaderView = new TapAPI.classes.views.LoaderView();

        if (TapAPI.social.enabled) {
            var socialPopupView = new TapAPI.classes.views.SocialPopupView();
            this.$el.append(socialPopupView.render().$el);
        }

        // trigger jquery mobile to initialize new widgets
        Backbone.trigger('app.widgets.refresh');

        return this;
    },
    runApp: function() {
        Backbone.trigger('tap.app.loading');
        // get browser language
        var browserLanguage = (navigator.language) ? navigator.language : navigator.userLanguage;
        TapAPI.language = browserLanguage.split('-')[0];

        //Load up the Router
        if (!_.isUndefined(TapAPI.classes.routers[TapAPI.primaryRouter])) {
            TapAPI.router = new TapAPI.classes.routers[TapAPI.primaryRouter]();
        } else {
            TapAPI.router = new TapAPI.classes.routers.Default();
        }

        // initialize Analytics
        if (!_.isUndefined(TapAPI.classes.models[TapAPI.trackerClass])) {
            TapAPI.tracker = new TapAPI.classes.models[TapAPI.trackerClass]({
                trackerId: TapAPI.trackerID
            });
        }

        // create new instance of tour collection
        TapAPI.tours = new TapAPI.classes.collections.TourCollection();
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