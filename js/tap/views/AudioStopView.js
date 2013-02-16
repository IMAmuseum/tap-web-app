define([
	'jquery',
	'underscore',
	'backbone',
	'tap/TapAPI',
	'tap/views/BaseView'
], function($, _, Backbone, TapAPI, BaseView) {
	var audioStopView = BaseView.extend({
		template: TemplateManager.get('audio-stop'),
		initialize: function() {
			this.timer = new AnalyticsTimer('AudioStop', 'played_for', TapAPI.currentStop.id);
			this.timer.reset();
		},
		render: function() {
			// Find the transcription if one exists
			var assets = this.model.getAssetsByUsage('transcription');
			var transcription = '';
			if (assets !== undefined) {
				transcription = assets[0].get('content').at(0).get('data');
			}

			// Find the poster image if one exists
			var posterImagePath = '';
			assets = this.model.getAssetsByUsage('image');
			if (assets !== undefined) {
				posterImagePath = assets[0].get('source').at(0).get('uri');
			}

			// Render from the template
			this.$el.html(this.template({
				title: this.model.get('title'),
				transcription: transcription,
				posterImagePath: posterImagePath
			}));

			// Add click handler on the transcription toggle button
			this.$el.find('#trans-button').click(function() {
				var t = $('.transcription').toggleClass('hidden');
				if (t.hasClass('hidden')) {
					$('.ui-btn-text', this).text('Show Transcription');
					TapAPI.gaq.push(['_trackEvent', 'AudioStop', 'hide_transcription']);
				} else {
					$('.ui-btn-text', this).text('Hide Transcription');
					TapAPI.gaq.push(['_trackEvent', 'AudioStop', 'show_transcription']);
				}
			});

			assets = this.model.getAssetsByType(['tour_audio', 'tour_video']);

			if (assets) {
				var audioPlayer = this.$el.find('#audio-player');
				var videoPlayer = this.$el.find('#video-player');
				var videoAspect;

				_.each(assets, function(asset) {
					var sources = asset.get('source');

					// Add sources to the media elements
					sources.each(function(source){
						var mediaSource = '<source src="' + source.get('uri') + '" type="' + source.get('format') + '" />';

						switch(source.get('format').substring(0,5)) {
							case 'audio':
								audioPlayer.append(mediaSource);
								break;
							case 'video':
								videoPlayer.append(mediaSource);
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

					mediaElement = audioPlayer;

				}

				var player = new MediaElementPlayer(mediaElement, mediaOptions);

				// mediaElement[0].addEventListener('loadedmetadata', function() {
				// 	TapAPI.audio_timer.max_threshold = mediaElement[0].duration * 1000;
				// });

				// mediaElement[0].addEventListener('play', function() {
				// 	TapAPI.gaq.push(['_trackEvent', 'AudioStop', 'media_started']);
				// 	TapAPI.audio_timer.start();
				// });

				// mediaElement[0].addEventListener('pause', function() {
				// 	TapAPI.gaq.push(['_trackEvent', 'AudioStop', 'media_paused']);
				// 	TapAPI.audio_timer.stop();
				// });

				// mediaElement[0].addEventListener('ended', function() {
				// 	TapAPI.gaq.push(['_trackEvent', 'AudioStop', 'media_ended']);
				// });

				player.play();
			}
			return this;
		},
		close: function() {
			// Send information about playback duration when the view closes
			this.timer.send();
			this.$el.find('.me-plugin').remove();
		}
	});
	return audioStopView;
});