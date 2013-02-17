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
        render: function(view) {
            var title = view && !_.isEmpty(view.title) ? view.title : '';
            this.$el.html(this.template({title: title}));
            return this;
        }
    });
    return headerView;
});