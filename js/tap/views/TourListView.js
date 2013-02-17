define([
    'jquery',
    'underscore',
    'backbone',
    'tap/TapAPI',
    'tap/TemplateManager',
    'tap/views/BaseView'
], function($, _, Backbone, TapAPI, TemplateManager, BaseView) {
	var tourListView = BaseView.extend({
		id: 'tour-list',
        attributes: {
            'data-role': 'content'
        },
		template: TemplateManager.get('tour-list'),
		initialize: function() {
			this._super('initialize');
			this.title = 'Select a Tour';
		},
		render: function() {
			this.$el.html(this.template({tours: TapAPI.tours.models}));
			return this;
		}
	});
	return tourListView;
});