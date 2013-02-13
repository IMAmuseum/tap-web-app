define([
    'tap/views/AppView',
    'jquery',
    'underscore',
    'backbone',
    'tap/views/BaseView',
    'tap/TemplateManager'
], function(App, $, _, Backbone, BaseView, TemplateManager) {
    var headerView = BaseView.extend({
        initialize: function() {
            console.log(App);
            this.template = TemplateManager.get('header');
            this.listenTo(Backbone, 'router.navigate', this.render);
        },
        render: function() {
            this.$el.html(this.template({title: 'blah'}));
            return this;
        }
    });
    return headerView;
});