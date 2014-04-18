/*
 * Backbone View for displaying a List of Available Tours
 */
TapAPI.classes.views.TourListView = TapAPI.classes.views.BaseView.extend({
	id: 'tour-list',
	template: TapAPI.templateManager.get('tour-list'),
	initialize: function(options) {
		this._super(options);
		this.title = 'Select a Tour';

		this.displayHeader = false;
		this.displayFooter = false;
		this.displayLoader = true;

		//update the view when tours are added to the collection
		Backbone.on('tap.tourml.parsed', this.render, this);
	},
	events: {
		'tap .tour-info' : 'tourInfoPopup'
	},
	render: function() {
		if (TapAPI.tours.length === 0 || TapAPI.tours.tourmlRequests > 0) {
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
			headers: headers
		}));

		Backbone.trigger('app.widgets.refresh');

		this.postRender();

		return this;
	},
	close: function() {
		if (this.displayLoader === true) {
			Backbone.trigger('tap.removeLoader');
		}
	},
	tourInfoPopup: function(e) {
		e.preventDefault();

		var target = $(e.target).parents('a.tour-info').data('tour-id');
		var tour = TapAPI.tours.get(target);

		Backbone.trigger('tap.popup.dislay', {
            title: tour.get('title'),
            message: tour.get('description'),
            cancelButtonTitle: 'Start Tour',
            routeAfterClose: TapAPI.router.getTourDefaultRoute(tour.get('id'))
        });
	},
	postRender : function () {
		if (TapAPI.tours.tourmlRequests === 0) {
            Backbone.trigger('tap.removeLoader');
        }
	}
});