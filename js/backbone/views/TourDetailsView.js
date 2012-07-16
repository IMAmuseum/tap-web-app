// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //

jQuery(function() {

	// Define the TourDetails View
	TapAPI.views.TourDetails = TapAPI.views.Page.extend({

		onInit: function() {
			this.options.page_title = this.model.get('title')[0].value;
			this.options.header_nav = false;
		},

		renderContent: function() {
			var content_template = TapAPI.templateManager.get('tour-details');

			$(":jqmData(role='content')", this.$el).append(content_template({
				tour_id: this.model.id,
				publishDate: this.model.get('publishDate') ? this.model.get('publishDate')[0].value : undefined,
				description: this.model.get('description') ? this.model.get('description')[0].value : undefined,
				stopCount: tap.tourStops.length,
				assetCount: tap.tourAssets.length
			}));

		}

	});

});
