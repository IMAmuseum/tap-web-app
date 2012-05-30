// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //

jQuery(function() {

	// Define the TourDetails View
	TapAPI.views.TourDetails = Backbone.View.extend({
		el: $('#tour-details').find(":jqmData(role='content')"),
		template: _.template($('#tour-details-tpl').html()),
		render: function() {
			var currentTour = tap.tours.get(tap.currentTour);

			$(this.el).html(this.template({
				publishDate: currentTour.get('publishDate') ? currentTour.get('publishDate')[0].value : undefined,
				description: currentTour.get('description') ? currentTour.get('description')[0].value : undefined,
				stopCount: tap.tourStops.length,
				assetCount: tap.tourAssets.length
			}));
			return this;
		}
	});
});
