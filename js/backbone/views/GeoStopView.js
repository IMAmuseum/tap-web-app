jQuery(function() {
		// setup a tour stop Geo view
		window.TourStopGeoView = Backbone.View.extend({
		    el: $('#tour-stop').find(":jqmData(role='content')"),
		    template: _.template($('#tour-stop-geo-tpl').html()),
		    render: function() {
				$(this.el).html(this.template({
					tourStopTitle : $stop["attributes"]["title"][0].value,
				}));
				return this;
		    }
		});				
});				
