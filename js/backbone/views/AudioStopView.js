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
	// setup a tour stop Audio view
	TapAPI.views.AudioStop = Backbone.View.extend({
		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: _.template($('#tour-stop-audio-tpl').html()),
		render: function() {
			var mp3AudioUri, oggAudioUri, wavAudioUri;

			if(tap.currentStop["attributes"]["assetRef"]){
				_.each(tap.currentStop.get("assetRef"), function(assetRef) {
					var asset = tap.tourAssets.get(assetRef.id);
					var assetSources = asset.get("source");

					_.each(assetSources, function(assetSource){
						switch (assetSource.format) {
							case 'audio/mp3':
							case 'audio/mpeg':
								mp3AudioUri = assetSource.uri;
								break;
							case 'audio/ogg':
								oggAudioUri = assetSource.uri;
								break;
							case 'audio/wav':
								wavAudioUri = assetSource.uri;
								break;
						}
					});
				});
			}

			this.$el.html(this.template({
				tourStopMp3Audio : mp3AudioUri,
				tourStopOggAudio : oggAudioUri,
				tourStopWavAudio : wavAudioUri,
				tourStopTitle : tap.currentStop["attributes"]["title"][0].value
			}));
			return this;
		}
	});
});
