// define assett collection
TapAssetCollection = Backbone.Collection.extend({
	model: TapAPI.models.Asset,
	initialize: function(models, id) {
		this.localStorage = new Backbone.LocalStorage(id + '-asset');
	}
});
