define([
	'underscore',
	'backbone',
	'tap/models/ContentModel',
	'localstorage'
], function(_, Backbone, ContentModel) {
	var contentCollection = Backbone.Collection.extend({
		model: ContentModel,
		initialize: function(models, options) {
			this.localStorage = new Backbone.LocalStorage(options.id + '-source');
			this.asset = options.asset;
		}
	});
	return contentCollection;
});