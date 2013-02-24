define([
    'jquery',
    'underscore',
    'backbone',
    'require',
    'tap/TapAPI',
    'tap/TemplateManager'
], function($, _, Backbone, Require, TapAPI, TemplateManager) {
    var socialPopupView = Backbone.View.extend({
        id: 'social-popup',
        attributes: {
            'data-role': 'popup',
            'data-theme': 'c'
        },
        template: TemplateManager.get('social-popup'),
        initialize: function() {
            this.uri = Backbone.history.fragment;

            // add listener for requests to display poup
            this.listenTo(Backbone, 'tap.socialPopup.dislay', this.displayPopup);
        },
        render: function() {
            this.$el.html(this.template({
                uri: this.uri
            }));
            return this;
        },
        displayPopup: function() {
            var that = this;

            // render the popup
            this.render();
            // intitialize jqmobile styles
            Backbone.trigger('app.widgets.refresh');
            // require social libraries
            Require(['twitter'], function() {
                // open popup
                that.$el.popup('open');
            });
            return false;
        }
    });
    return socialPopupView;
});