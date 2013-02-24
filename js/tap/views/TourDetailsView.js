define([
    'jquery',
    'underscore',
    'backbone',
    'tap/TapAPI',
    'tap/TemplateManager',
    'tap/views/BaseView'
], function($, _, Backbone, TapAPI, TemplateManager, BaseView) {
	var tourDetailsView = BaseView.extend({
		id: 'tour-details',
		template: TemplateManager.get('tour-details'),
		initialize: function() {
			this._super('initialize');

			this.tour = TapAPI.tours.get(TapAPI.currentTour);
			this.title = this.tour.get('title');

			this.displayFooter = false;
		},
		render: function() {
            var defaultController;
            for (var controller in TapAPI.navigationControllers) {
                if (_.has(TapAPI.navigationControllers[controller], 'defaultView') &&
                    TapAPI.navigationControllers[controller].defaultView) {
                    defaultController = controller;
                    break;
                }
            }

			this.$el.html(this.template({
				defaultStopSelectionView: defaultController,
				tourID: this.tour.get('id'),
				description: this.tour.get('description') ? this.tour.get('description') : ''
			}));
			return this;
		}
	});
	return tourDetailsView;
});