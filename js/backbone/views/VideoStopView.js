// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //

// Add this view to the registry
TapAPI.views.registry['tour_video_stop'] = 'VideoStop';

// TODO: remove this deprecated mapping
TapAPI.views.registry['VideoStop'] = 'VideoStop';

jQuery(function() {

	// Define the VideoStop View
	TapAPI.views.VideoStop = TapAPI.views.Page.extend({

		renderContent: function() {
			var content_template = TapAPI.templateManager.get('video-stop');

			$(":jqmData(role='content')", this.$el).append(content_template({
				tourStopTitle: this.model.get('title')[0].value
			}));

			var asset_refs = tap.currentStop.get("assetRef");

			if (asset_refs) {
				_.each(asset_refs, function(assetRef) {
					var asset = tap.tourAssets.get(assetRef.id);
					var assetSources = asset.get("source");

					_.each(assetSources, function(assetSource){
						$('video', this.$el).append("<source src='" + assetSource.uri + "' type='" + assetSource.format + "' />");
					}, this);
				}, this);
			}

			return this;
		}
	});
});
