define([
    'underscore',
    'jquery',
    'backbone',
    'tap/TapAPI',
    'tap/views/BaseView',
    'tap/TemplateManager'
], function(_, $, Backbone, TapAPI, BaseView, TemplateManager) {
    var footerView = BaseView.extend({
        id: 'footer',
        attributes: {
            'data-role': 'footer',
            'data-position': 'fixed',
            'data-tap-toggle': 'false'
        },
        template: TemplateManager.get('footer'),
        initialize: function() {
            this.listenTo(Backbone, 'tap.router.routed', this.render);
        },
        render: function(view) {
            if (!_.isUndefined(TapAPI.currentTour) && view.displayFooter) {
                this.$el.show();
                this.$el.html(this.template({tourID: TapAPI.currentTour}));
            } else {
                this.$el.hide();
            }
            return this;
        }
    });
    return footerView;
});