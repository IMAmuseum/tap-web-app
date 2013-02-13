define([
    'jquery',
    'underscore',
    'backbone',
    'tap/views/BaseView',
    'tap/TemplateManager'
], function($, _, Backbone, BaseView, TemplateManager) {
    var footerView = BaseView.extend({
        intialize: function() {
            this.template = TemplateManager.get('footer');
            this.listenTo(Backbone, 'router.navigate', this.render);
        },
        render: function() {
            this.$el.html(this.template());
            return this;
        }
    });
    return footerView;
});