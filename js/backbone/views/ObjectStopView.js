jQuery(function() {
	// setup a tour stop Object view
	window.TourStopObjectView = Backbone.View.extend({
		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: _.template($('#tour-stop-object-tpl').html()),
		render: function() {
			$(this.el).html(this.template({
				tourStopTitle : tap.currentStop["attributes"]["title"][0].value
			}));
			return this;
		}
	});
});
