define([
	'underscore',
	'backbone',
	'tap/models/AssetModel'
], function(_, Backbone, AssetModel) {
	var assetCollection = Backbone.Collection.extend({
		model: AssetModel,
		initialize: function(models, id) {
			this.localStorage = new Backbone.LocalStorage(id + '-asset');
		}
	});
	return assetCollection;
});