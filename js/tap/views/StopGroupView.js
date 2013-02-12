define([
    'jquery',
    'underscore',
    'backbone',
    'tap/views/AppView',
    'tap/StopGroupListItem'
], function($, _, Backbone, App, StopGroupListItem) {
	stopGroupView = TapAPI.views.BaseView.extend({
		renderContent: function() {
			var content_template = TapAPI.templateManager.get('stop-group');
			var template_args = {
				tourStopTitle : this.model.get('title')
			};

			var description = this.model.get("description");
			if (description !== undefined) {
				template_args['description'] = description;
			} else {
				template_args['description'] = '';
			}

			this.$el.find(":jqmData(role='content')").append(content_template(template_args));

			var connections = this.model.get('connection');
			var listContainer = this.$el.find("#stop-list");
			_.each(connections, function(connection) {
				var stop = tap.tourStops.get(connection.destId);
				if (stop) {
					var stopView = new StopGroupListItem({
						model: stop
					});
					listContainer.append(stopView.render().$el);
				}
			});

		}
	});
	return stopGroupView;
});