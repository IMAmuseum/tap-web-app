jQuery(function() {
	// setup a tour stop Gallery view
	window.TourStopGalleryView = Backbone.View.extend({
		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: _.template($('#tour-gallery-tpl').html()),
		render: function() {
			this.$el.html(this.template({
				tourStopTitle : tap.currentStop.get("title")[0].value
			}));
			var myPhotoSwipe = $("#Gallery a").photoSwipe({
				enableMouseWheel: false,
				enableKeyboard: true,
				doubleTapZoomLevel : 0,
				captionAndToolbarOpacity : 0.8,
				minUserZoom : 0.0,
				jQueryMobile : true
			});
			return this;
		}
	});
});
