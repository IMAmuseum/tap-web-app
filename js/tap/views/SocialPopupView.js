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
            // add listener for requests to display poup
            this.listenTo(Backbone, 'tap.socialPopup.dislay', this.displayPopup);
        },
        render: function() {
            this.$el.html(this.template());
            return this;
        },
        displayPopup: function() {
            var that = this;
            Require(['facebook-api', 'twitter-api'], function() {
                that.$el.popup('open');
            });
            return false;
        },
        closeDialog: function() {
            this.$el.popup('close');
        }
    });
    return socialPopupView;
});