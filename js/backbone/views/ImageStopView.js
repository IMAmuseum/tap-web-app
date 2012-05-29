jQuery(function() {
	// setup a tour stop Image view
	window.TourStopImageView = Backbone.View.extend({
		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: _.template($('#tour-stop-image-tpl').html()),
		render: function() {
			var imageUri, iconUri;

			if(tap.currentStop["attributes"]["assetRef"]){
				$.each(tap.currentStop["attributes"]["assetRef"], function() {
					$assetItem = tap.tourAssets.models;
					for(var i=0;i<$assetItem.length;i++) {
						if(($assetItem[i].get('id') == this['id']) && (this['usage'] == "primary" || this['usage'] == "tour_image")){
							imageUri = $assetItem[i].attributes.source[0].uri;
						}
						if(($assetItem[i].get('id') == this['id']) && (this['usage']=="icon")){
							iconUri = $assetItem[i].attributes.source[0].uri;
						}
					}
				});
			}

			this.$el.html(this.template({
				tourImageUri : imageUri,
				tourIconUri : iconUri,
				tourStopTitle : tap.currentStop["attributes"]["title"][0].value
			}));

			var soloPhotoSwipe = $("#soloImage a").photoSwipe({
				enableMouseWheel: false,
				enableKeyboard: true,
				doubleTapZoomLevel : 0,
				captionAndToolbarOpacity : 0.8,
				minUserZoom : 0.0,
				preventSlideshow : true,
				jQueryMobile : true
			});
			
			return this;
		}
	});
});