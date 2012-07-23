// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //

// Add this view to the registry
TapAPI.views.registry['tour_image_stop'] = 'ImageStop';

// TODO: remove this deprecated mapping
TapAPI.views.registry['ImageStop'] = 'ImageStop';

jQuery(function() {

	// Define the ImageStop View
	TapAPI.views.ImageStop = TapAPI.views.Page.extend({

		renderContent: function() {

			var asset_refs = tap.currentStop.get("assetRef");
			var content_template = TapAPI.templateManager.get('image-stop');
			var imageTemplate = TapAPI.templateManager.get('image-stop-item');

			if (asset_refs) {
				this.$el.find(":jqmData(role='content')").append(content_template());

				var gallery = this.$el.find("#gallery");

				$.each(asset_refs, function(assetRef) {
					var asset = tap.tourAssets.get(this.id);

					if (this.usage === "image_asset") {
						var templateData = {};
						var sources = asset.get('source');
						sources.each(function(source) {
							switch (source.get('format').substring(0,5)) {
								case "image":
									templateData.fullImageUri = source.get("uri");
									templateData.thumbUri = source.get("uri");
									break;
								//TODO: this needs to be figured out how it will get passed in
								case "thumbnail":
									templateData.thumbUri = source.get("uri");
									break;
							}
						});

						var content = asset.get('content');
						content.each(function(contentItem) {
							console.log(contentItem);
							switch(contentItem.get("part")) {
								case "title":
									templateData.title = contentItem.get("data");
									break;
								case "caption":
									templateData.caption = contentItem.get("caption");
									break;
							}
						});

						gallery.append(imageTemplate(templateData));
					}
				});


				var photoSwipe = gallery.photoSwipe({
					enableMouseWheel: false,
					enableKeyboard: true,
					doubleTapZoomLevel : 0,
					captionAndToolbarOpacity : 0.8,
					minUserZoom : 0.0,
					preventSlideshow : true,
					jQueryMobile : true
				});
			}
			
			return this;
		}
	});
});