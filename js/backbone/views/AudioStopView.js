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
	TapAPI.views.AudioStop = TapAPI.views.Page.extend({

		onInit: function() {
			this.mediaElement = null;
		},

		renderContent: function() {

			var content_template = TapAPI.templateManager.get('audio-stop');
			var contentContainer = this.$el.find(":jqmData(role='content')");

			contentContainer.append(content_template({
				tourStopTitle: this.model.get('title')[0].value
			}));

			var asset_refs = tap.currentStop.get("assetRef");

			if (asset_refs) {
				var audioPlayer = this.$el.find('#audio-player');
				var videoPlayer = this.$el.find('#video-player');
				var videoAspect;

				_.each(asset_refs, function(assetRef) {

					var asset = tap.tourAssets.get(assetRef.id);
					var assetSources = asset.get("source");

					_.each(assetSources, function(assetSource) {

						var source_str = "<source src='" + assetSource.uri + "' type='" + assetSource.format + "' />";

						switch(assetSource.format.substring(0,5)) {
							case 'audio':
								audioPlayer.append(source_str);
								break;
							case 'video':
								console.log(assetSource);
								videoPlayer.append(source_str);
								
								break;
							default:
								console.log('Unsupported format for audio asset:', assetSource);
						}

					}, this);
				}, this);

				var mediaOptions = {};
				var mediaElement = null;
				// If there are video sources and no audio sources, switch to the video element
				if (videoPlayer.find('source').length && !audioPlayer.find('source').length) {
					audioPlayer.remove();
					videoPlayer.show();
					mediaOptions.defaultVideoWidth = '100%';
					// mediaOptions.defaultVideoHeight = 270;

					mediaElement = videoPlayer;
				} else {
					videoPlayer.remove();
					mediaOptions.defaultAudioWidth = '100%';
					//mediaOptions.defaultAudioHeight = 270;

					mediaElement = audioPlayer;
				}
				mediaElement.mediaelementplayer(mediaOptions);
			}

			return this;
		}
	});
});
