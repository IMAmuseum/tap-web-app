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

	// Define the StopGroup view
	TapAPI.views.StopGroup = TapAPI.views.Page.extend({

		content_template: TapAPI.templateManager.get('stop-group'),

		renderContent: function() {

			var template_args = {
				tourStopTitle : this.model.get('title')[0].value
			};

			var description = this.model.get("description");
			if (description !== undefined) {
				template_args['description'] = description[0].value;
			} else {
				template_args['description'] = '';
			}

			$(":jqmData(role='content')", this.$el).append(this.content_template(template_args));

			var connections = this.model.get('connection');
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
