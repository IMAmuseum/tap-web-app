define([
    'jquery',
    'underscore',
    'backbone',
    'tap/TapAPI',
    'tap/views/BaseView',
    'tap/TemplateManager'
], function($, _, Backbone, TapAPI, BaseView, TemplateManager) {
    var headerView = BaseView.extend({
        id: 'header',
        attributes: {
            'data-role': 'header',
            'data-position': 'fixed',
            'data-tap-toggle': 'false'
        },
        template: TemplateManager.get('header'),
        initialize: function() {
            this.listenTo(Backbone, 'tap.router.routed', this.render);
        },
        events: {
            'tap #back-button': 'navigateBack',
            'tap #social-button': 'displaySocialPopup'
        },
        render: function(view) {
            var title = view && !_.isEmpty(view.title) ? view.title : '';
            this.$el.html(this.template({title: title}));

            // don't show the back button on the root
            if (Backbone.history.getFragment() === '') {
                this.$el.find('#back-btn').hide();
            } else {
                this.$el.find('#back-btn').show();
            }

            return this;
        },
        navigateBack: function(e) {
            e.preventDefault();
            window.history.back();
        },
        displaySocialPopup: function(e) {
            e.preventDefault();
            Backbone.trigger('tap.socialPopup.dislay');
        }
    });
    return headerView;
});