// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //

jQuery(function() {

	// Define the TourDetails View
	TapAPI.views.TourDetails = TapAPI.views.Page.extend({

		onInit: function() {
			this.options.page_title = this.model.get('title');
			this.options.header_nav = false;
		},

		renderContent: function() {
			var content_template = TapAPI.templateManager.get('tour-details');

			this.$el.find(":jqmData(role='content')").append(content_template({
				tour_index: tap.config.default_index,
				tour_id: this.model.id,
				publishDate: this.model.get('publishDate') ? this.model.get('publishDate') : undefined,
				description: this.model.get('description') ? this.model.get('description') : undefined,
				stopCount: tap.tourStops.length,
				assetCount: tap.tourAssets.length
			}));

		}

	});

});
