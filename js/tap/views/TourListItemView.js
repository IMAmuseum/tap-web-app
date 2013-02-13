define([
    'jquery',
    'underscore',
    'backbone',
    'tap/views/BaseView'
], function($, _, Backbone, BaseView) {
	var tourListItemVIew = BaseView.extend({
		tagName: 'li',
		template: TapAPI.templateManager.get('tour-list-item'),
		render: function() {
			this.$el.html(this.template({
				title: this.model.get('title') ? this.model.get('title') : undefined,
				id: this.model.get('id')
			}));
			return this;
		}
	});
	return tourListItemVIew;
});