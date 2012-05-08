jQuery(function() {
	// setup a detailed view of a tour
	window.TourDetailedView = Backbone.View.extend({
		el: $('#tour-details').find(":jqmData(role='content')"),
		template: _.template($('#tour-details-tpl').html()),
		render: function() {
			$(this.el).html(this.template({
				publishDate: tap.tours.get(tap.currentTour).get('publishDate')[0].value,
				description: tap.tours.get(tap.currentTour).get('description')[0].value,
				stopCount: tap.tourStops.length,
				assetCount: tap.tourAssets.length
			}));
			return this;
		}
	});
});
