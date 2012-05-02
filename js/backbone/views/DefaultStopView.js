jQuery(function() {
		// setup a tour stop view
		window.TourStopView = Backbone.View.extend({
		    el: $('#tour-stop').find(":jqmData(role='content')"),
		    template: _.template($('#tour-stop-tpl').html()),
		    render: function() {
				$(this.el).html(this.template({
					tourStopTitle : $stop["attributes"]["title"][0].value,
					tourStopDescription : $stop["attributes"]["description"][0].value,
				}));
				return this;
		    }
		});				
});				
