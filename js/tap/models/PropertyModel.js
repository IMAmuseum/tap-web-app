define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	var propertyModel = Backbone.Model.extend({
		defaults: {
			'name': undefined,
			'value': undefined,
			'lang': undefined
		}
	});
	return propertyModel;
});