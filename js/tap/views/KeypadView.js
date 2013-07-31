/*
 * Backbone View for displaying the KeyPad navigation
 */
TapAPI.classes.views.KeypadView = TapAPI.classes.views.StopSelectionView.extend({
    id: 'keypad',
    template: TapAPI.templateManager.get('keypad'),
    initialize: function(options) {
        this._super(options);
        this.title = 'Enter a Stop Code';
        this.activeToolbarButton = 'KeypadView';
        this.code = '';
    },
    events: {
        'tap #go-button' : 'submit',
        'tap .keypad-button' : 'inputKeyCode',
        'tap #clear-button' : 'clearKeyCode'
    },
    render: function() {
        this.$el.html(this.template());
        return this;
    },
    submit: function() {
        this.code = this.$el.find('#code-label').html();
        TapAPI.tracker.trackEvent('Navigation', 'tapped', 'KeyPad-Go', this.code);

        var stop = TapAPI.tourStops.getStopByKeycode(this.code);
        if(_.isEmpty(stop)) {
            Backbone.trigger('tap.popup.dislay', {
                title: 'Stop Not Found',
                message: 'Stop not found for code \'' + this.code + '\'',
                cancelButtonTitle: 'OK'
            });

            this.$el.find('#code-label').html('');
            this.code = '';
            return false;
        } else {
            Backbone.history.navigate(stop.getRoute(false), {trigger: true});
        }
    },
    inputKeyCode: function(e) {
        e.preventDefault();
        this.code += $(e.currentTarget).find('.ui-btn-text').html();

        if (this.code.length > 6) return;

        this.$el.find('#go-button').removeClass('ui-disabled');

        $('#code-label').html(this.code);
    },
    clearKeyCode: function() {
        TapAPI.tracker.trackEvent('Navigation', 'tapped', 'KeyPad-Clear', null);
        this.$el.find('#go-button').addClass('ui-disabled');
        this.$el.find('#code-label').html('');
        this.code = '';
    }
});