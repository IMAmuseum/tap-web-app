jQuery(function() {
	// setup a tour stop Audio view
	window.TourStopAudioView = Backbone.View.extend({
		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: _.template($('#tour-stop-audio-tpl').html()),
		render: function() {
			if($stop["attributes"]["assetRef"]){
				$.each($stop["attributes"]["assetRef"], function() {
					$assetItem = tap.tourAssets.models;
					for(var i=0;i<$assetItem.length;i++) {
						if($assetItem[i].get('id') == this['id']){
							for(var j=0;j<$assetItem[i].attributes.source.length;j++){
								if($assetItem[i].attributes.source[j].format == "audio/mp3"){
									$mp3AudioUri = $assetItem[i].attributes.source[j].uri;
								}
								if($assetItem[i].attributes.source[j].format == "audio/ogg"){
									$oggAudioUri = $assetItem[i].attributes.source[j].uri;
								}
								if($assetItem[i].attributes.source[j].format == "audio/wav"){
									$wavAudioUri = $assetItem[i].attributes.source[j].uri;
								}
							}
						}
					}
				});
			}
			$(this.el).html(this.template({
				tourStopMp3Audio : $mp3AudioUri,
				tourStopOggAudio : $oggAudioUri,
				tourStopWavAudio : $wavAudioUri,
				tourStopTitle : $stop["attributes"]["title"][0].value
			}));
			return this;
		}
	});
});
