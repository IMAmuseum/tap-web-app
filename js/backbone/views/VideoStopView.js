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

			var assets = this.model.getAssetsByUsage("transcription");
			var transcription = null;
			if (assets !== undefined) {
				transcription = assets[0].get('content').at(0).get('data');
			}

			this.$el.find(":jqmData(role='content')").append(content_template({
				tourStopTitle: this.model.get('title'),
				transcription: transcription
			}));

			this.$el.find('#trans-button').click(function() {
				var t = $('.transcription').toggleClass('hidden');
				if (t.hasClass('hidden')) {
					$('.ui-btn-text', this).text('Show Transcription');
				} else {
					$('.ui-btn-text', this).text('Hide Transcription');
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


			return this;
		}
	});
});
