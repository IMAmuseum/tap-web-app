define([
    'jquery',
    'underscore',
    'backbone',
    'tap/views/BaseView',
    'tap/TemplateManager'
], function($, _, Backbone, BaseView, TemplateManager) {
    var footerView = BaseView.extend({
        attributes: {
            'data-role': 'footer',
            'data-id': 'foo1',
            'data-position': 'fixed',
            'data-tap-toggle': 'false'
        },
        template: TemplateManager.get('footer'),
        initialize: function() {
            this.listenTo(Backbone, 'tap.router.routed', this.render);
        },
        render: function() {
            this.$el.html(this.template());
            return this;
        }
    });
    return footerView;
});