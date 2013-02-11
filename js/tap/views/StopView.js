define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
	var stopView = TapAPI.views.BaseView.extend({
		renderContent: function() {
			var content_template = TapAPI.templateManager.get('stop');

			this.$el.find(":jqmData(role='content')").append(content_template({
				tourStopTitle : this.model.get("title") ? this.model.get("title") : undefined,
				tourStopDescription : this.model.get('description') ? this.model.get('description') : undefined
			}));
			return this;
		}
	});
	return stopView;
});