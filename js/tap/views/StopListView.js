define([
    'jquery',
    'underscore',
    'backbone',
    'tap/TapAPI',
    'tap/TemplateManager',
    'tap/views/BaseView'
], function($, _, Backbone, TapAPI, TemplateManager, BaseView) {
	var stopListView = BaseView.extend({
		id: 'tour-stop-list',
		tagName: 'ul',
		className: 'ui-listview',
		attributes: {
			'data-inset': true,
			'data-role': 'listview',
			'data-filter': true
		},
		template: TemplateManager.get('stop-list'),
		initialize: function() {
			this._super('initialize');
			this.title = 'Select a Stop';

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