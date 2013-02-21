define([
    'jquery',
    'underscore',
    'backbone',
    'tap/views/BaseView',
    'tap/TemplateManager'
], function($, _, Backbone, BaseView, TemplateManager) {
    var contentView = BaseView.extend({
        id: 'content-wrapper',
        attributes: {
            'data-role': 'content'
        },
        initialize: function() {
            this.currentView = undefined;
            this.listenTo(Backbone, 'tap.router.routed', this.render);
        },
        render: function(view) {
            if (view === undefined) return this;

            // cleanup previous view
            if (this.currentView !== undefined) {
                this.$el.removeClass(this.currentView.id);
                this.currentView.close();
            }
            // set current view
            this.currentView = view;
            // add the new view
            this.$el.addClass(view.id);
            this.$el.html(view.render().$el);
            _.delay(function() {
                view.finishedAddingContent();
            }, 100);

            return this;
        }
    });
    return contentView;
});