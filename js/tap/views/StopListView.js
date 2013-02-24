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

			// apply filter
			if (TapAPI.navigationControllers.StopListView.filterBy === 'stopGroup') {
				// retrieve all stops that are stop groups
				this.stops = _.filter(TapAPI.tourStops.models, function(stop) {
					return stop.get('view') === 'stop_group';
				});
			} else {
				// retrieve all stops that have a code associated with it
				this.stops = _.filter(TapAPI.tourStops.models, function(stop) {
					return stop.get('propertySet').where({'name': 'code'}) !== undefined;
				});
			}

			// apply sorting
			if (TapAPI.navigationControllers.StopListView.sortBy === 'title') {
				// sort by title
				this.stops = _.sortBy(this.stops, function(stop) {
					return stop.get('title');
				});
			} else {
				// sort by their key code
				this.stops = _.sortBy(this.stops, function(stop) {
					return stop.get('propertySet').where({'name': 'code'});
				});
			}

			_.each(this.stops, function(stop) {
				var stopConfig = TapAPI.viewRegistry[stop.get('view')];
				if (stopConfig) {
					stop.set('icon', stopConfig.icon);
				}
			}, this);
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