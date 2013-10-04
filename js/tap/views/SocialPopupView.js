/*
 * Backbone View for displaying social sharing features
 */
TapAPI.classes.views.SocialPopupView = Backbone.View.extend({
    id: 'social-popup',
    className: 'ui-corner-all',
    attributes: {
        'data-role': 'popup',
        'data-theme': 'a',
        'data-overlay-theme': 'a'
    },
    template: TapAPI.templateManager.get('social-popup'),
    initialize: function() {
        // add listener for requests to display poup
        this.listenTo(Backbone, 'tap.socialPopup.dislay', this.displayPopup);
    },
    render: function() {
        this.$el.html(this.template({
            title: TapAPI.social.title,
            FBAppID: TapAPI.social.facebook.appID,
            url: escape(document.URL)
        }));
        return this;
    },
    displayPopup: function() {
        // render the popup
        this.render();
        // intitialize jqmobile styles
        Backbone.trigger('app.widgets.refresh');
        // open popup
        this.$el.popup('open');

        return false;
    }
});