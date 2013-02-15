define([
    'jquery',
    'underscore',
    'backbone',
    'tap/TapAPI',
    'tap/TemplateManager',
    'tap/views/BaseView'
], function($, _, Backbone, TapAPI, TemplateManager, BaseView) {
	var tourDetailsView = BaseView.extend({
		template: TemplateManager.get('tour-details'),
		initialize: function() {

		},
		render: function() {
			var currentTour = TapAPI.tours.get(TapAPI.currentTour);
			this.$el.html(this.template({
				defaultStopSelectionView: 'keypad',
				tourID: currentTour.get('id'),
				description: currentTour.get('description') ? currentTour.get('description') : ''
			}));
			return this;
		}
	});
	return tourDetailsView;
});