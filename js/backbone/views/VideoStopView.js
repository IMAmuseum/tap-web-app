jQuery(function() {
	// setup a tour stop Video view
	window.TourStopVideoView = Backbone.View.extend({
		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: _.template($('#tour-stop-video-tpl').html()),
		render: function() {
			var mp4ViedoUri, oggVideoUri;
			if($stop["attributes"]["assetRef"]){
				_.each($stop.get("assetRef"), function(assetRef) {
					var asset = tap.tourAssets.get(assetRef.id);
					var assetSources = asset.get("source");

					_.each(assetSources, function(assetSource){
						switch (assetSource.format) {
							case 'video/mp4':
								mp4VideoUri = assetSource.uri;
								break;
							case 'video/ogg':
								oggVideoUri = assetSource.uri;
								break;
						}
					});
				});
			}

			this.$el.html(this.template({
				tourStopTitle : $stop["attributes"]["title"][0].value,
				tourStopMp4Video : mp4VideoUri,
				tourStopOggVideo : oggVideoUri
			}));

			return this;
		}
	});
});
