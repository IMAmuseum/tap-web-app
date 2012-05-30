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
	TapAPI.views.VideoStop = Backbone.View.extend({

		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: _.template($('#tour-stop-video-tpl').html()),

		render: function() {

			var mp4ViedoUri, oggVideoUri;
			var asset_refs = tap.currentStop.get("assetRef");

			if (asset_refs) {
				_.each(asset_refs, function(assetRef) {
					var asset = tap.tourAssets.get(assetRef.id);
					var assetSources = asset.get("source");

					_.each(assetSources, function(assetSource){
						switch (assetSource.format) {
							case 'video/mp4':
								mp4VideoUri = assetSource.uri;
								break;
							case 'video/ogg':
								oggVideoUri = assetSource.uri;
								break;
						}
					});
				});
			}

			this.$el.html(this.template({
				tourStopTitle : tap.currentStop.get("title")[0].value,
				tourStopMp4Video : mp4VideoUri,
				tourStopOggVideo : oggVideoUri
			}));

			return this;
		}
	});
});