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
		},
		events: {
			'tap #go-btn' : 'submit',
			'tap #keypad .button' : 'inputKeyCode',
			'tap #delete' : 'clearKeyCode'
		},
		render: function() {
			this.$el.html(this.template());
			return this;
		},
		submit: function() {
			var code = this.$el.find('#code-label').html();

			var stop = TapAPI.tourStops.getStopByKeycode(code);
			if(_.isEmpty(stop)) {
				Backbone.trigger('tap.dialog.dislay', {
					title: 'Stop Not Found',
					message: 'Stop not found for code \'' + code + '\'',
					cancelButtonTitle: 'OK'
				});
				this.$el.find('#code-label').html('');
				return false;
			} else {
				Backbone.history.navigate('tour/' + TapAPI.currentTour + '/stop/' + stop.get('id'), true);
			}
		},
		inputKeyCode: function(e) {
			var code = this.$el.find('#code-label').html() + $(e.currentTarget).html();

			this.$el.find('#go-btn').removeClass('ui-disabled');

			$('#code-label').html(code);
		},
		clearKeyCode: function() {
			this.$el.find('#gobtn').addClass('ui-disabled');
			this.$el.find('#code-label').html('');
		}
	});
	return keypad;
});