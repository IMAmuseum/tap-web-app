define([
    'jquery',
    'underscore',
    'backbone',
    'tap/TapAPI',
    'tap/TemplateManager'
], function($, _, Backbone, TapAPI, TemplateManager) {
    var popupView = Backbone.View.extend({
        id: 'popup-view',
        attributes: {
            'data-role': 'popup',
            'data-theme': 'c'
        },
        template: TemplateManager.get('popup'),
        initialize: function() {
            this.title = '';
            this.message = '';
            this.cancelButtonTitle = '';

            // add listener for requests to display dialogs
            this.listenTo(Backbone, 'tap.popup.dislay', this.displayDialog);
        },
        events: {
            'tap #popup-cancel': 'closeDialog'
        },
        render: function() {
            this.$el.html(this.template({
                title: this.title,
                message: this.message,
                cancelButtonTitle: this.cancelButtonTitle
            }));

            return this;
        },
        displayDialog: function(args) {
            // set popup content
            this.title = args.title;
            this.message = args.message;
            this.cancelButtonTitle = args.cancelButtonTitle;

            // render the popup
            this.render();
            // intitialize jqmobile styles
            Backbone.trigger('app.widgets.refresh');
            // open up popup
            this.$el.popup('open');
            return false;
        },
        closeDialog: function() {
            this.title = '';
            this.message = '';
            this.cancelButtonTitle = '';

            this.$el.popup('close');
        }
    });
    return popupView;
});