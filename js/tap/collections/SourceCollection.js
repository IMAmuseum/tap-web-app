define([
	'underscore',
	'backbone',
	'tap/models/SourceModel'
], function(_, Backbone, App, SourceModel) {
	var sourceCollection = Backbone.Collection.extend({
		model: SourceModel,
		initialize: function(models, options) {
			this.localStorage = new Backbone.LocalStorage(options.id + '-source');
			this.asset = options.asset;
		}
	});
	return sourceCollection;
});