jQuery(function() {
	// setup a tour stop view
	window.TourStopView = Backbone.View.extend({
		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: _.template($('#tour-stop-tpl').html()),
		render: function() {
			this.$el.html(this.template({
				tourStopTitle : $stop.get("title") ? $stop.get("title")[0].value : undefined,
				tourStopDescription : $stop.get('description') ? $stop.get('description')[0].value : undefined
			}));
			return this;
		}
	});
});
