jQuery(function() {
	// setup a tour stop Video view
	window.TourStopVideoView = Backbone.View.extend({
		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: _.template($('#tour-stop-video-tpl').html()),
		render: function() {
			if($stop["attributes"]["assetRef"]){
				$.each($stop["attributes"]["assetRef"], function() {
					$assetItem = tap.tourAssets.models;
					for(var i=0;i<$assetItem.length;i++) {
						if($assetItem[i].get('id') == this['id']){
							for(var j=0;j<$assetItem[i].attributes.source.length;j++){
								if($assetItem[i].attributes.source[j].format == "video/mp4"){
									$mp4VideoUri = $assetItem[i].attributes.source[j].uri;
								}
								if($assetItem[i].attributes.source[j].format == "video/ogg"){
									$oggVideoUri = $assetItem[i].attributes.source[j].uri;
								}
							}
						}
					}
				});
			}
			$(this.el).html(this.template({
				tourStopTitle : $stop["attributes"]["title"][0].value,
				tourStopMp4Video : $mp4VideoUri,
				tourStopOggVideo : $oggVideoUri
			}));
			return this;
		}
	});
});
