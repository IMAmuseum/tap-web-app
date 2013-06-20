/*
 * Backbone View for displaying the Header
 * Includes back navigation, title and social charing button
 */
TapAPI.classes.views.HeaderView = Backbone.View.extend({
    id: 'header',
    attributes: {
        'data-role': 'header',
        'data-position': 'fixed',
        'data-tap-toggle': 'false'
    },
    template: TapAPI.templateManager.get('header'),
    initialize: function() {
        this.listenTo(Backbone, 'tap.router.routed', this.render);
    },
    events: {
        'tap #back-button': 'navigateBack',
        'tap #social-button': 'displaySocialPopup'
    },
    render: function(view) {
        var title = view && !_.isEmpty(view.title) ? view.title : '';

        this.$el.html(this.template({
            displayBackButton: Backbone.history.getFragment() !== '' && !(view && !view.displayBackButton),
            title: title,
            displaySocialButton: TapAPI.social.enabled
        }));

        return this;
    },
    navigateBack: function(e) {
        e.preventDefault();

        TapAPI.tracker.trackEvent('Navigation', 'tapped', 'back', null);

        if (_.isNull(TapAPI.currentStop)) {
            Backbone.history.navigate('', {trigger: true});
        } else {
            window.history.back();
        }
    },
    displaySocialPopup: function(e) {
        e.preventDefault();
        Backbone.trigger('tap.socialPopup.dislay');
    }
});