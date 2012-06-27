// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //


/**
 * The MapView supports the display of multiple tours or a single tour
 */

jQuery(function() {

	// Define the Map View
	TapAPI.views.Map = Backbone.View.extend({
		el: $('#tour-map-page').find(":jqmData(role='content')"),
		template: TapAPI.templateManager.get('tour-map'),
		attributes: {
			'data-init-lat': 39.829104,
			'data-init-lon': -86.189504,
			'data-init-zoom': 16
		},
		map: null,
		render: function() {

			//var currentTour = tap.tours.get(tap.currentTour);

			$(this.el).html(this.template());
			this.map = new L.Map('tour-map');

			var cloudmade = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>',
			    maxZoom: 18
			});

			console.log(this.attributes['data-init-lat']);
			// add the CloudMade layer to the map set the view to a given center and zoom
			this.map.addLayer(cloudmade).setView(
				new L.LatLng(this.attributes['data-init-lat'], this.attributes['data-init-lon']),
				this.attributes['data-init-zoom']
			);

			this.resizeContentArea();

			$(window).bind('orientationchange pageshow resize', this.resizeContentArea);

			return this;
		},

		resizeContentArea: function() {
			var content, contentHeight, footer, header, viewportHeight;
			window.scroll(0, 0);
			header = $(":jqmData(role='header'):visible");
			footer = $(":jqmData(role='footer'):visible");
			content = $(":jqmData(role='content'):visible");
			viewportHeight = $(window).height();
			contentHeight = viewportHeight - header.outerHeight() - footer.outerHeight();
			$("article:jqmData(role='content')").first().height(contentHeight);
			return $("#tour-map").height(contentHeight);
		},

		close: function() {
			$(window).unbind('orientationchange pageshow resize', this.resizeContentArea);
		}

	});

});