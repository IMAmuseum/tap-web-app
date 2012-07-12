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

		content_template: TapAPI.templateManager.get('image-stop'),

		renderContent: function() {

			var imageUri, iconUri;
			var asset_refs = tap.currentStop.get("assetRef");

			if (asset_refs) {
				$.each(asset_refs, function() {
					$assetItem = tap.tourAssets.models;
					for(var i=0;i<$assetItem.length;i++) {
						if(($assetItem[i].get('id') == this['id']) && (this['usage'] == "primary" || this['usage'] == "tour_image")){
							imageUri = $assetItem[i].get('source')[0].uri;
						}
						if(($assetItem[i].get('id') == this['id']) && (this['usage']=="icon")){
							iconUri = $assetItem[i].get('source')[0].uri;
						}
					}
				});
			}

			$(":jqmData(role='content')", this.$el).append(this.content_template({
				tourImageUri : imageUri,
				tourIconUri : iconUri,
				tourStopTitle : tap.currentStop.get("title")[0].value
			}));
			
			var soloPhotoSwipe = $("#soloImage a", this.$el).photoSwipe({
				enableMouseWheel: false,
				enableKeyboard: true,
				doubleTapZoomLevel : 0,
				captionAndToolbarOpacity : 0.8,
				minUserZoom : 0.0,
				preventSlideshow : true,
				jQueryMobile : true
			});
			
			return this;
		}
	});
});