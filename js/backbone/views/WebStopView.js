jQuery(function() {
	// setup a tour stop Web view
	window.TourStopWebView = Backbone.View.extend({
		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: _.template($('#tour-stop-web-tpl').html()),
		render: function() {
			$(this.el).html(this.template({
				tourStopTitle : tap.currentStop.get("title")[0].value
			}));
			return this;
		}
	});
});