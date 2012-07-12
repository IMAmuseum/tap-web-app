// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //


jQuery(function() {

	// Define the stop list view
	TapAPI.views.StopList = TapAPI.views.Page.extend({

		content_template: TapAPI.templateManager.get('tour-stop-list'),

		renderContent: function() {

			$(":jqmData(role='content')", this.$el).append(this.content_template());

			// TODO: figure out a better way to avoid rendering again
			//if ($('li', this.$el).length == tap.tourStops.models.length) return;

			_.each(tap.tourStops.models, function(stop) {
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