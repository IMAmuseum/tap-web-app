define([
    'jquery',
    'underscore',
    'backbone',
    'tap/TapAPI',
    'tap/TemplateManager'
], function($, _, Backbone, TapAPI, TemplateManager) {
    var dialogView = Backbone.View.extend({
        id: 'dialog-view',
        attributes: {
            'data-role': 'popup',
            'data-theme': 'c'
        },
        template: TemplateManager.get('dialog'),
        initialize: function() {
            this.title = '';
            this.message = '';
            this.cancelButtonTitle = '';

            // add listener for requests to display dialogs
            this.listenTo(Backbone, 'tap.dialog.dislay', this.displayDialog);
        },
        events: {
            'tap #dialog-cancel': 'closeDialog'
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
            // set dialog content
            this.title = args.title;
            this.message = args.message;
            this.cancelButtonTitle = args.cancelButtonTitle;

            // render the dialog
            this.render();
            // intitialize jqmobile styles
            Backbone.trigger('app.widgets.refresh');
            // open up dialog
            this.$el.popup('open');
        },
        closeDialog: function() {
            this.title = '';
            this.message = '';
            this.cancelButtonTitle = '';

            this.$el.popup('close');
        }
    });
    return dialogView;
});