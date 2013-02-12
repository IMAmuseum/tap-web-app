define([
    'jquery',
    'underscore',
    'backbone',
    'tap/views/AppView',
    'tap/views/BaseView',
    'tap/StopGroupListItem'
], function($, _, Backbone, App, BaseView) {
	var stopGroupListItem = BaseView.extend({
		tagName: 'li',
		template: TapAPI.templateManager.get('stop-group-list-item'),
		render: function() {
			this.$el.html(this.template({
				title: this.model.get('title') ? this.model.get('title') : undefined,
				id: this.model.get('id'),
				tourId: App.tap.currentTour
			}));
			return this;
		}
	});
	return stopGroupListItem;
});