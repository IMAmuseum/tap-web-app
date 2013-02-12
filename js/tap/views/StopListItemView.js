define([
    'jquery',
    'underscore',
    'backbone',
    'tap/views/AppView',
    'tap/views/BaseView'
], function($, _, Backbone, App, BaseView) {
	var stopListItemView = BaseView.extend({
		tagName: 'li',
		template: TapAPI.templateManager.get('tour-stop-list-item'),
		render: function() {
			this.$el.attr('id', 'stoplistitem-' + this.model.get('id'));
			this.$el.html(this.template({
				title: this.model.get('title') ? this.model.get('title') : undefined,
				stop_id: this.model.get('id'),
				tour_id: App.tap.currentTour,
				distance: TapAPI.geoLocation.formatDistance(this.model.get('distance'))
			}));
			$('#tour-stop-list').listview('refresh');
			return this;
		}
	});
	return stopListItemView;
});