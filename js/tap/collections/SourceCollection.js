define([
	'underscore',
	'backbone',
	'tap/models/SourceModel',
	'localStorage'
], function(_, Backbone, SourceModel) {
	var sourceCollection = Backbone.Collection.extend({
		model: SourceModel,
		initialize: function(models, options) {
			this.localStorage = new Backbone.LocalStorage(options.id + '-source');
			this.asset = options.asset;
		}
	});
	return sourceCollection;
});