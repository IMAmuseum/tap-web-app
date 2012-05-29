jQuery(function() {
	// setup a tour stop Audio view
	window.TourStopGroupView = Backbone.View.extend({
		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: _.template($('#tour-stop-group-tpl').html()),
		render: function() {
			this.$el.html(this.template({
				tourStopTitle : getAttributeByLanguage(tap.currentStop.get("title"))[0].value,
				description : getAttributeByLanguage(tap.currentStop.get("description"))[0].value
			}));

			var connections = tap.currentStop.get('connection');
			var listContainer = this.$el.find("#stop-list");
			_.each(connections, function(connection) {
				var stop = tap.tourStops.get(connection.destId);
				if (stop) {
					var stopView = new TourListItemView({
						model: stop
					});

					listContainer.append(stopView.render().$el);
				}
			});
			
			listContainer.listview();

			return this;
		}
	});

	// setup an individual view of a tour
	window.TourStopGroupListItemView = Backbone.View.extend({
		tagName: 'li',
		template: _.template($('#tour-stop-group-list-item-tpl').html()),
		render: function() {
			this.$el.html(this.template({
				title: this.model.get('title') ? this.model.get('title')[0].value : undefined,
				id: this.model.get('id'),
				tourId: tap.currentTour
			}));
			return this;
		}
	});
});
