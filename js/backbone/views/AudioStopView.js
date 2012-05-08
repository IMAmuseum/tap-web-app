jQuery(function() {
	// setup a tour stop Audio view
	window.TourStopAudioView = Backbone.View.extend({
		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: _.template($('#tour-stop-audio-tpl').html()),
		render: function() {
			var mp3AudioUri, oggAudioUri, wavAudioUri;

			if($stop["attributes"]["assetRef"]){
				_.each($stop.get("assetRef"), function(assetRef) {
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
				tourStopTitle : $stop["attributes"]["title"][0].value
			}));
			return this;
		}
	});
});
