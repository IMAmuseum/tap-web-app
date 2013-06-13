/*
 * Backbone View for displaying a jquery mobile pop-up
 */
TapAPI.classes.views.PopupView = Backbone.View.extend({
    id: 'popup-view',
    className: 'ui-corner-all',
    attributes: {
        'data-role': 'popup',
        'data-theme': 'a',
        'data-overlay-theme': 'a'
    },
    template: TapAPI.templateManager.get('popup'),
    initialize: function() {
        this.title = '';
        this.message = '';
        this.cancelButtonTitle = '';
        this.routeAfterClose = '';

        // add listener for requests to display dialogs
        this.listenTo(Backbone, 'tap.popup.dislay', this.displayDialog);
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
        // set popup content
        this.title = args.title;
        this.message = args.message;
        this.cancelButtonTitle = args.cancelButtonTitle;
        this.routeAfterClose = args.routeAfterClose;

        // render the popup
        this.render();
        // intitialize jqmobile styles
        Backbone.trigger('app.widgets.refresh');
        // open up popup
        this.$el.popup('open');
        return false;
    },
    closeDialog: function(e) {
        e.preventDefault();

        this.title = '';
        this.message = '';
        this.cancelButtonTitle = '';

        this.$el.popup('close');

        if (this.routeAfterClose && this.routeAfterClose.length) {
            Backbone.history.navigate(this.routeAfterClose, {trigger: true});
        }
    }
});