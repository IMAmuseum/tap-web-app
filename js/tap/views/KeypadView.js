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
			'tap #gobtn' : 'submit',
			'tap #keypad .button' : 'inputKeyCode',
			'tap #delete' : 'clearKeyCode'
		},
		render: function() {
			this.$el.html(this.template());
			return this;
		},
		submit: function() {
			var code = $('#code').html();

			if (_.isEmpty(code)) {
				// TODO Display notification
				return;
			}

			var stop = TapAPI.tourStops.getStopByKeycode(code);
			if(_.isEmpty(stop)) {
				// TODO: Display notification
				$('#write').html('');
				return;
			}
			Backbone.history.navigate('tour/' + TapAPI.currentTour + '/stop/' + stop.get('id'), true);
		},
		inputKeyCode: function(e) {
			var code = this.$el.find('#code').html() + $(e.currentTarget).html();
			$('#code').html(code);
		},
		clearKeyCode: function() {
			$('#code').html('');
		}
	});
	return keypad;
});