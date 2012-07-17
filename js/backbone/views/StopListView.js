// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //


jQuery(function() {

	// Define the stop list view
	TapAPI.views.StopList = TapAPI.views.Page.extend({

		onInit: function() {
			this.options.active_index = 'tourstoplist';
		},

		renderContent: function() {
			var content_template = TapAPI.templateManager.get('tour-stop-list');

			$(":jqmData(role='content')", this.$el).append(content_template());

			// TODO: figure out a better way to avoid rendering again
			//if ($('li', this.$el).length == tap.tourStops.models.length) return;

			_.each(tap.tourStops.models, function(stop) {

				// If in codes-only mode, abort if the stop does not have a code
				if (tap.config.StopListView.codes_only) {
					var code = undefined;
					_.each(stop.get('propertySet'), function(prop) {
						if (prop.name == 'code') code = prop.value;
					});
					if (code === undefined) return;
				}

				var item = new TapAPI.views.StopListItem({model: stop});
				$('#tour-stop-list', this.$el).append(item.render().el);
				
			}, this);

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