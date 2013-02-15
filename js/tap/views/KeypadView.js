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
			// validate tour stop code
			if(!$('#c').html()) return;
			if(!TapAPI.tourStops.getStopByKeycode($('#write').html())){
				TapAPI.router.showDialog('error', 'This is an invalid code. Please enter another.');
				$('#write').html('');
				return;
			}
			$destUrl = '#tourstop/' + TapAPI.currentTour + '/code/' + $('#write').html();
			Backbone.history.navigate($destUrl, true);
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