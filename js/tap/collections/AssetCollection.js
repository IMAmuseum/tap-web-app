define([
	'underscore',
	'backbone',
	'tap/models/AssetModel',
	'localStorage'
], function(_, Backbone, AssetModel) {
	var assetCollection = Backbone.Collection.extend({
		model: AssetModel,
		initialize: function(models, id) {
			this.localStorage = new Backbone.LocalStorage(id + '-asset');
		}
	});
	return assetCollection;
});