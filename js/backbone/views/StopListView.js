// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //


/**
 * The MapView supports the display of multiple tours or a single tour
 */

jQuery(function() {

	// Define the stop list view
	TapAPI.views.StopList = Backbone.View.extend({

		el: $('#tour-stop-list'),

		initialize: function() {
			this.$el.empty();
			this.model.bind('reset', this.render);
		},

		render: function() {

			// TODO: figure out a better way to avoid rendering again
			if ($('li', this.$el).length == tap.tourStops.models.length) return;

			_.each(tap.tourStops.models, function(stop) {
				var item = new TapAPI.views.StopListItem({model: stop});
				this.$el.append(item.render().el);
			}, this);

			this.$el.listview('refresh');
			return this;
		},

		close: function() {
			// Override base close function so that events are not unbound
		}

	});

	// Define the item view to populate this list
	TapAPI.views.StopListItem = Backbone.View.extend({

		tagName: 'li',
		template: TapAPI.templateManager.get('tour-stop-list-item'),

		render: function() {
			$(this.el).html(this.template({
				title: this.model.get('title') ? this.model.get('title')[0].value : undefined,
				stop_id: this.model.get('id'),
				tour_id: tap.currentTour
			}));
			return this;
		}

	});

});