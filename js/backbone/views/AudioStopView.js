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

			if (tap.audio_timer === undefined) {
				tap.audio_timer = new AnalyticsTimer('AudioStop', 'played_for', tap.currentStop.id);
			}
			tap.audio_timer.reset();
			console.log('init');

		},

		renderContent: function() {

			var content_template = TapAPI.templateManager.get('audio-stop');
			var contentContainer = this.$el.find(":jqmData(role='content')");

			// Find the transcription if one exists
			var assets = this.model.getAssetsByUsage("transcription");
			var transcription = null;
			if (assets !== undefined) {
				transcription = assets[0].get('content').at(0).get('data');
			}

			// Find the poster image if one exists
			var poster_image_path = null;
			assets = this.model.getAssetsByUsage("image");
			if (assets !== undefined) {
				poster_image_path = assets[0].get('source').at(0).get('uri');
			}

			// Render from the template
			contentContainer.append(content_template({
				tour_stop_title: this.model.get('title'),
				transcription: transcription,
				poster_image_path: poster_image_path
			}));

			// Add click handler on the transcription toggle button
			this.$el.find('#trans-button').click(function() {
				var t = $('.transcription').toggleClass('hidden');
				if (t.hasClass('hidden')) {
					$('.ui-btn-text', this).text('Show Transcription');
					_gaq.push(['_trackEvent', 'AudioStop', 'hide_transcription']);
				} else {
					$('.ui-btn-text', this).text('Hide Transcription');
					_gaq.push(['_trackEvent', 'AudioStop', 'show_transcription']);
				}
			});

			assets = this.model.getAssetsByType(["tour_audio", "tour_video"]);

			if (assets) {

				var audioPlayer = this.$el.find('#audio-player');
				var videoPlayer = this.$el.find('#video-player');
				var videoAspect;

				_.each(assets, function(asset) {
					var sources = asset.get('source');

					// Add sources to the media elements
					sources.each(function(source){
						var source_str = "<source src='" + source.get('uri') + "' type='" + source.get('format') + "' />";

						switch(source.get('format').substring(0,5)) {
							case 'audio':
								audioPlayer.append(source_str);
								break;
							case 'video':
								videoPlayer.append(source_str);
								
								break;
							default:
								console.log('Unsupported format for audio asset:', assetSource);
						}
					});
				});

				var mediaOptions = {
					flashName: tapBasePath() + mejs.MediaElementDefaults.flashName,
					silverlightName: tapBasePath() + mejs.MediaElementDefaults.flashName
				};

				var mediaElement = null;

				// If there are video sources and no audio sources, switch to the video element
				if (videoPlayer.find('source').length && !audioPlayer.find('source').length) {

					audioPlayer.remove();
					this.$el.find('.poster-image').remove();
					videoPlayer.show();
					mediaOptions.defaultVideoWidth = '100%';
					mediaOptions.defaultVideoHeight = 270;

					mediaElement = videoPlayer;

				} else {

					videoPlayer.remove();
					mediaOptions.defaultAudioWidth = '100%';
					//mediaOptions.defaultAudioHeight = 270;

					mediaElement = audioPlayer;

				}

				mediaElement.mediaelementplayer(mediaOptions);

				mediaElement[0].addEventListener('loadedmetadata', function() {
					tap.audio_timer.max_threshold = mediaElement[0].duration * 1000;
				});

				mediaElement[0].addEventListener('play', function() {
					_gaq.push(['_trackEvent', 'AudioStop', 'media_started']);
					tap.audio_timer.start();
				});

				mediaElement[0].addEventListener('pause', function() {
					_gaq.push(['_trackEvent', 'AudioStop', 'media_paused']);
					tap.audio_timer.stop();
				});

				mediaElement[0].addEventListener('ended', function() {
					_gaq.push(['_trackEvent', 'AudioStop', 'media_ended']);
				});

			}

			return this;
		},

		onClose: function() {

			// Send information about playback duration when the view closes
			tap.audio_timer.send();
			$('.me-plugin').remove();

		}

	});
});
