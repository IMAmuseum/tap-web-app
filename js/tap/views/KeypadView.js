define([
    'jquery',
    'underscore',
    'backbone',
    'tap/TapAPI',
    'tap/TemplateManager',
    'tap/views/BaseView'
], function($, _, Backbone, TapAPI, TemplateManager, BaseView) {
    var keypad = BaseView.extend({
        id: 'keypad',
        template: TemplateManager.get('keypad'),
        initialize: function() {
            this._super('initialize');
            this.title = 'Enter a Stop Code';
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

            var stop = TapAPI.tourStops.getStopByKeycode(this.code);
            if(_.isEmpty(stop)) {
                Backbone.trigger('tap.dialog.dislay', {
                    title: 'Stop Not Found',
                    message: 'Stop not found for code \'' + this.code + '\'',
                    cancelButtonTitle: 'OK'
                });
                this.$el.find('#code-label').html('');
                return false;
            } else {
                Backbone.history.navigate('tour/' + TapAPI.currentTour + '/stop/' + stop.get('id'), true);
            }
        },
        inputKeyCode: function(e) {
            e.preventDefault();
            this.code += $(e.currentTarget).find('.ui-btn-text').html();

            if (this.code.length > 4) return;

            this.$el.find('#go-button').removeClass('ui-disabled');

            $('#code-label').html(this.code);
        },
        clearKeyCode: function() {
            this.$el.find('#go-button').addClass('ui-disabled');
            this.$el.find('#code-label').html('');
            this.code = '';
        }
    });
    return keypad;
});