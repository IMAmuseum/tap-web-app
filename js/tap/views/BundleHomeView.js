/*
 * Backbone View for displaying a "home screen" type view
 */
TapAPI.classes.views.BundleHomeView = TapAPI.classes.views.BaseView.extend({
	id: 'bundle-home',
	template: TapAPI.templateManager.get('bundle-home'),
	initialize: function(options) {
		this._super(options);
		this.title = 'Welcome, Weary Traveler';
		this.headerImageUri = TapConfig.bundleHomeHeaderImageUri;

		this.displayHeader = false;
		this.displayFooter = false;

		//update the view when tours are added to the collection
		Backbone.on('tap.tourml.parsed', this.render, this);
	},
	events: {
		'tap .tour-info' : 'tourSelected'
	},
	render: function() {
		if (TapAPI.tours.length === 0) {
			return this;
		}

		var tours = TapAPI.tours.sortBy(function(tour) {
			tour.get("title");
		});

		var headers = [];
		_.each(tours, function(tour) {
			TapAPI.tours.selectTour(tour.get('id'));
			headers.push(tour.getAppResourceByUsage('image'));
		});

		this.$el.html(this.template({
			tours: tours,
			headers: headers,
			headerImageUri: this.headerImageUri
		}));

		Backbone.trigger('app.widgets.refresh');

		return this;
	},
	tourSelected: function(e) {
		e.preventDefault();
		var target = $(e.target).data('tour-id');
		var tour = TapAPI.tours.get(target);
		TapAPI.router.navigate(TapAPI.router.getTourDefaultRoute(tour.get('id')), {trigger: true});
	}
});