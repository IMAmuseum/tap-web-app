/*
 * Backbone View for displaying a Tour Summary/Start screen
 */
TapAPI.classes.views.TourDetailsView = TapAPI.classes.views.BaseView.extend({
	id: 'tour-details',
	template: TapAPI.templateManager.get('tour-details'),
	initialize: function(options) {
		this._super(options);

		this.tour = TapAPI.tours.get(TapAPI.currentTour);

		this.displayFooter = false;
        this.displayBackButton = false;
        if (TapAPI.tours.length > 1) {
            this.displayBackButton = true;
        }
	},
	render: function() {
        var defaultRoute = TapAPI.router.getTourDefaultRoute(TapAPI.currentTour);

        var header = this.tour.getAppResourceByUsage('image');

		this.$el.html(this.template({
            title: this.tour.get('title'),
            header: header,
			defaultStopSelectionView: defaultRoute,
			tourID: this.tour.get('id'),
			description: this.tour.get('description') ? this.tour.get('description') : ''
		}));
		return this;
	}
});