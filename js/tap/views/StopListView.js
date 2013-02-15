define([
    'jquery',
    'underscore',
    'backbone',
    'tap/TapAPI',
    'tap/templateManager',
    'tap/views/BaseView'
], function($, _, Backbone, TapAPI, TemplateManager, BaseView) {
	var stopListView = BaseView.extend({
		template: TemplateManager.get('stop-list'),
		initialize: function() {
			this._super('initialize');
			this.title = 'Select a Stop';

			// retrieve all stop groups
			this.stops = _.filter(TapAPI.tourStops.models, function(stop) {
				return stop.get('view') === 'tour_stop_group';
			});

			// sort by their key code
			this.stops = _.sortBy(this.stops, function(stop) {
				return stop.get('propertySet').where({'name': 'code'});
			});
		},
		render: function() {
			this.$el.html(this.template({
				tourID: TapAPI.currentTour,
				stops: this.stops
			}));
			return this;
		}
	});
	return stopListView;
});