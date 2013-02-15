define([
    'jquery',
    'underscore',
    'backbone',
    'tap/TapAPI',
    'tap/views/StopView'
], function($, _, Backbone, TapAPI, StopView) {
	var videoStopView = StopView.extend({
		onInit: function() {

			if (TapAPI.video_timer === undefined) {
				TapAPI.video_timer = new AnalyticsTimer('VideoStop', 'played_for', TapAPI.currentStop.id);
			}
			TapAPI.video_timer.reset();
		},
		renderContent: function() {
			var content_template = TapAPI.templateManager.get('video-stop');

			// Find the transcription if one exists
			var assets = this.model.getAssetsByUsage("transcription");
			var transcription = null;
			if (assets !== undefined) {
				transcription = assets[0].get('content').at(0).get('data');
			}

			// Find the poster image if one exists
			var poster_image_path = TapAPI.config['default_video_poster'];
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
					TapAPI.gaq.push(['_trackEvent', 'VideoStop', 'hide_transcription']);
				} else {
					$('.ui-btn-text', this).text('Hide Transcription');
					TapAPI.gaq.push(['_trackEvent', 'VideoStop', 'show_transcription']);
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

				videoContainer[0].addEventListener('loadedmetadata', function() {
					TapAPI.video_timer.max_threshold = videoContainer[0].duration * 1000;
				});

				videoContainer[0].addEventListener('play', function() {
					TapAPI.gaq.push(['_trackEvent', 'VideoStop', 'media_started']);
					TapAPI.video_timer.start();
				}, this);

				videoContainer[0].addEventListener('pause', function() {
					TapAPI.gaq.push(['_trackEvent', 'VideoStop', 'media_paused']);
					TapAPI.video_timer.stop();
				});

				videoContainer[0].addEventListener('ended', function() {
					TapAPI.gaq.push(['_trackEvent', 'VideoStop', 'playback_ended']);
				});
			}
			return this;
		},

		onClose: function() {
			// Send information about playback duration when the view closes
			TapAPI.video_timer.send();
		}
	});
	return videoStopView;
});