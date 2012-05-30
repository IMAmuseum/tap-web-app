// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //

// Add this view to the registry
TapAPI.views.registry['tour_stop_group'] = 'StopGroup';

// TODO: remove this deprecated mapping
TapAPI.views.registry['StopGroup'] = 'StopGroup';

jQuery(function() {
	// setup a tour stop Audio view
	TapAPI.views.StopGroup = Backbone.View.extend({
		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: TapAPI.templateManager.get('stop-group'),
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
					var stopView = new TapAPI.views.StopGroupListItem({
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
	TapAPI.views.StopGroupListItem = Backbone.View.extend({
		tagName: 'li',
		template: TapAPI.templateManager.get('stop-group-list-item'),
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
