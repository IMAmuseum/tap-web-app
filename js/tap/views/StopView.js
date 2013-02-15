define([
    'jquery',
    'underscore',
    'backbone',
    'tap/views/BaseView'
], function($, _, Backbone, BaseView) {
	var stopView = BaseView.extend({
		initialize: function() {
			this._super('initialize');
		}
	});
	return stopView;
});