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

			this.displayFooter = false;
            this.displayBackButton = false;
            if (TapAPI.tours.length > 1) {
                this.displayBackButton = true;
            }
		},
		render: function() {
            var defaultController, controller;

            // get tour specific default navigation controller
            if (!_.isUndefined(TapAPI.tourSettings[TapAPI.currentTour]) &&
                TapAPI.tourSettings[TapAPI.currentTour].defaultNavigationController) {
                defaultController = TapAPI.tourSettings[TapAPI.currentTour].defaultNavigationController;
            }

            // get first controller if none were selected as a default
            if (_.isUndefined(defaultController)) {
                for (controller in TapAPI.navigationControllers) {
                    defaultController = controller;
                    break;
                }
            }

            var header;
            _.each(this.tour.get('appResource'), function(resource) {
                // Make sure this is a geo asset reference
                if (!_.isUndefined(resource) && resource.usage === 'image') {
                    var asset = TapAPI.tourAssets.get(resource.id);
                    var source = asset.get('source');
                    if (!_.isUndefined(source)) {
                        header = source.at(0).get('uri');
                    }
                }
            });

			this.$el.html(this.template({
                title: this.tour.get('title'),
                header: header,
				defaultStopSelectionView: defaultController,
				tourID: this.tour.get('id'),
				description: this.tour.get('description') ? this.tour.get('description') : ''
			}));
			return this;
		}
	});
	return tourDetailsView;
});