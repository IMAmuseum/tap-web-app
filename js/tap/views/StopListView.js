define([
    'jquery',
    'underscore',
    'backbone',
    'tap/TapAPI',
    'tap/TemplateManager',
    'tap/views/StopSelectionView'
], function($, _, Backbone, TapAPI, TemplateManager, StopSelectionView) {
	var stopListView = StopSelectionView.extend({
		id: 'tour-stop-list',
		template: TemplateManager.get('stop-list'),
		initialize: function() {
			this._super('initialize');
			this.title = 'Select a Stop';
			this.activeToolbarButton = 'StopListView';

			// retrieve all stops that have a code associated with it
			this.stops = _.filter(TapAPI.tourStops.models, function(stop) {
				return stop.get('propertySet').where({'name': 'code'}) !== undefined;
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