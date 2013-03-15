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
		template: TemplateManager.get('tour-list'),
		initialize: function() {
			this._super('initialize');
			this.title = 'Select a Tour';

			this.displayHeader = false;
			this.displayFooter = false;
		},
		events: {
			'tap .tour-info' : 'tourInfoPopup'
		},
		render: function() {
			this.$el.html(this.template({tours: TapAPI.tours.models}));
			return this;
		},
		tourInfoPopup: function(e) {
			e.preventDefault();

			var target = $(e.target).parents('a.tour-info').data('tour-id');
			var tour = TapAPI.tours.get(target);

			Backbone.trigger('tap.popup.dislay', {
                title: tour.get('title'),
                message: tour.get('description'),
                cancelButtonTitle: 'Start Tour',
                routeAfterClose: TapAPI.router.getTourDefaultRoute(tour.get('id'))
            });
		}
	});
	return tourListView;
});