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
            var defaultController = _.find(TapAPI.navigationControllers, function(controller) {
                return _.has(controller, 'defaultView') && controller.defaultView;
            });

			this.$el.html(this.template({
				defaultStopSelectionView: defaultController.view,
				tourID: this.tour.get('id'),
				description: this.tour.get('description') ? this.tour.get('description') : ''
			}));
			return this;
		}
	});
	return tourDetailsView;
});