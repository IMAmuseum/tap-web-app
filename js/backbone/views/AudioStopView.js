// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //

// Add this view to the registry
TapAPI.views.registry['tour_audio_stop'] = 'AudioStop';

// TODO: remove this deprecated mapping
TapAPI.views.registry['AudioStop'] = 'AudioStop';

jQuery(function() {

	// Define the AudioStop View
	TapAPI.views.AudioStop = Backbone.View.extend({

		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: TapAPI.templateManager.get('audio-stop'),

		render: function() {

			var asset_refs = tap.currentStop.get("assetRef");

			this.$el.html(this.template({
				tourStopTitle : tap.currentStop.get("title")[0].value
			}));

			if (asset_refs) {
				_.each(asset_refs, function(assetRef) {

					var asset = tap.tourAssets.get(assetRef.id);
					var assetSources = asset.get("source");

					_.each(assetSources, function(assetSource) {

						var source_str = "<source src='" + assetSource.uri + "' type='" + assetSource.format + "' />";

						switch(assetSource.format.substring(0,5)) {
							case 'audio':
								$('#audio-player', this.$el).append(source_str);
								break;
							case 'video':
								$('#video-player', this.$el).append(source_str);
								break;
							default:
								console.log('Unsupported format for audio asset:', assetSource);
						}

					});
				});

				// If there are video sources and no audio sources, switch to the video element
				if ($('#video-player source').length && !$('#audio-player source').length) {
					$('#audio-player').hide();
					$('#video-player').show();
				}

			}

			return this;
		}
	});
});
