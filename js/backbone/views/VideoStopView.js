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

			// Find the transcription if one exists
			var assets = this.model.getAssetsByUsage("transcription");
			var transcription = null;
			if (assets !== undefined) {
				transcription = assets[0].get('content').at(0).get('data');
			}

			// Find the poster image if one exists
			var poster_image_path = tap.config['default_video_poster'];
			assets = this.model.getAssetsByUsage("image");
			if (assets !== undefined) {
				poster_image_path = assets[0].get('source').at(0).get('uri');
			}

			// Render from the template
			this.$el.find(":jqmData(role='content')").append(content_template({
				tourStopTitle: this.model.get('title'),
				transcription: transcription,
				poster_image_path: poster_image_path
			}));

			// Add click handler on the transcription toggle button
			this.$el.find('#trans-button').click(function() {
				var t = $('.transcription').toggleClass('hidden');
				if (t.hasClass('hidden')) {
					$('.ui-btn-text', this).text('Show Transcription');
					_gaq.push(['_trackEvent', 'VideoStop', 'hide_transcription']);
				} else {
					$('.ui-btn-text', this).text('Hide Transcription');
					_gaq.push(['_trackEvent', 'VideoStop', 'show_transcription']);
				}
			});

			assets = this.model.getAssetsByType("tour_video");
			if (assets.length) {
				var videoContainer = this.$el.find('video');
				_.each(assets, function(asset) {
					var sources = asset.get("source");
					sources.each(function(source) {
						videoContainer.append("<source src='" + source.get('uri') + "' type='" + source.get('format') + "' />");
					});
				});
			}

			mediaElement[0].addEventListener('play', function() {
				_gaq.push(['_trackEvent', 'VideoStop', 'media_started']);
			});

			mediaElement[0].addEventListener('pause', function() {
				_gaq.push(['_trackEvent', 'VideoStop', 'media_paused']);
			});

			mediaElement[0].addEventListener('ended', function() {
				console.log('ended');
				_gaq.push(['_trackEvent', 'VideoStop', 'playback_ended']);
			});

			return this;
		}
	});
});
