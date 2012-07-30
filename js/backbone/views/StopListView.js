// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //


jQuery(function() {

	// Define the stop list view
	TapAPI.views.StopList = TapAPI.views.Page.extend({

		onInit: function() {

			this.options = _.defaults(this.options, {
				active_index: 'tourstoplist',
				codes_only: true,
				enable_proximity_order: false
			});

			if (this.options.enable_proximity_order) {
				TapAPI.geoLocation.on("gotlocation", this.onLocationFound, this);
			}

		},

		renderContent: function() {
			var content_template = TapAPI.templateManager.get('tour-stop-list');

			this.$el.find(":jqmData(role='content')").append(content_template({
				enable_proximity_order: this.options.enable_proximity_order
			}));

			// TODO: figure out a better way to avoid rendering again
			//if ($('li', this.$el).length == tap.tourStops.models.length) return;

			var listContainer = this.$el.find('#tour-stop-list');
			
			_.each(tap.tourStops.models, function(stop) {

				// If in codes-only mode, abort if the stop does not have a code
				if (this.options.codes_only) {
					var code = stop.get('propertySet').where({"name":"code"});
					if (!code.length) return;
				}

				var item = new TapAPI.views.StopListItem({model: stop});
				listContainer.append(item.render().el);
				if (this.options.enable_proximity_order) {
					stop.on("change:distance", this.onStopDistanceChanged, item);
					stop.on("change:nearest", this.onNearestStopChanged, item);
				}

			}, this);

			if (this.options.enable_proximity_order) {
				TapAPI.geoLocation.startLocating();
			}

		},


		onStopDistanceChanged: function(stop, distance) {

			var item = $('#stoplistitem-' + stop.get('id') + ' .ui-btn-text a', '#tour-stop-list');
			var span = $('span.distance', item);
			if (span.length) {
				span.html(TapAPI.geoLocation.formatDistance(distance));
			} else {
				item.append("<span class='distance'>" + TapAPI.geoLocation.formatDistance(distance) + "</span>");
			}

		},


		onNearestStopChanged: function(stop) {

			if (stop.get('nearest')) {
				this.$el.addClass('nearest');
			} else {
				this.$el.removeClass('nearest');
			}

		},


		onLocationFound: function(position) {

			console.log('onLocationFound', position);
			var latlng = new L.LatLng(position.coords.latitude, position.coords.longitude);

		},


		onClose: function() {
			TapAPI.geoLocation.stopLocating();
		}

	});

	// Define the item view to populate this list
	TapAPI.views.StopListItem = Backbone.View.extend({

		tagName: 'li',
		template: TapAPI.templateManager.get('tour-stop-list-item'),
		render: function() {
			$(this.el).attr('id', 'stoplistitem-' + this.model.get('id'));
			console.log('StopListItem.render', this);
			$(this.el).html(this.template({
				title: this.model.get('title') ? this.model.get('title') : undefined,
				stop_id: this.model.get('id'),
				tour_id: tap.currentTour
			}));
			$('#tour-stop-list').listview('refresh');
			return this;
		}

	});

});