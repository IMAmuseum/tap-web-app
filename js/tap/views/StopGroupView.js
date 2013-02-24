define([
    'jquery',
    'underscore',
    'backbone',
    'tap/TapAPI',
    'tap/views/BaseView',
    'tap/TemplateManager'
], function($, _, Backbone, TapAPI, BaseView, TemplateManager) {
	stopGroupView = BaseView.extend({
		template: TemplateManager.get('stop-group'),
		initialize: function() {
			this._super('initialize');
			this.title = this.model.get('title');
		},
		render: function() {
			var stops = [];
			_.each(this.model.get('connection'), function(connection) {
				var stop = TapAPI.tourStops.get(connection.destId);
				if (stop) {
					stops.push({
						id: stop.get('id'),
						title: stop.get('title'),
						icon: TapAPI.viewRegistry[stop.get('view')].icon
					});
				}
			});

			var description = this.model.get('description');
			this.$el.html(this.template({
				tourID: TapAPI.currentTour,
				description: _.isEmpty(description) ? '' : description,
				stops: stops
			}));

			return this;
		}
	});
	return stopGroupView;
});