define([
    'jquery',
    'underscore',
    'backbone',
    'tap/TapAPI',
    'tap/views/BaseView',
    'tap/TemplateManager'
], function($, _, Backbone, TapAPI, BaseView, TemplateManager) {
    var contentView = BaseView.extend({
        attributes: {
            id: 'content-wrapper',
            'data-role': 'content'
        },
        initialize: function() {
            this.listenTo(Backbone, 'tap.router.routed', this.render);
        },
        render: function(view) {
            if (view === undefined) return this;

            if (TapAPI.currentView !== undefined) {
                TapAPI.currentView.close();
            }
            TapAPI.currentView = view;

            this.$el.html(view.render().$el);
            return this;
        }
    });
    return contentView;
});