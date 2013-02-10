TapAPI.views.TourDetails = TapAPI.views.BaseView.extend({
	onInit: function() {
		this.options.page_title = this.model.get('title');
		this.options.header_nav = false;
		this.options.footer_nav = false;
	},
	renderContent: function() {
		var content_template = TapAPI.templateManager.get('tour-details');

		this.$el.find(":jqmData(role='content')").append(content_template({
			tour_index: tap.config.default_nav_item,
			tour_id: this.model.id,
			publishDate: this.model.get('publishDate') ? this.model.get('publishDate') : undefined,
			description: this.model.get('description') ? this.model.get('description') : undefined,
			stopCount: tap.tourStops.length,
			assetCount: tap.tourAssets.length
		}));

	}

});