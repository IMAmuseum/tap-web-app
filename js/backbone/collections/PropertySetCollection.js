// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.collections === 'undefined'){TapAPI.collections = {};}
// TapAPI Namespace Initialization //

// define assett collection
TapAPI.collections.PropertySet = Backbone.Collection.extend({
	model: TapAPI.models.Property,
	initialize: function(models, id) {
		this.localStorage = new Backbone.LocalStorage(id + '-propertyset');
	},
	getByName: function(propertyName) {
		return this.where({"name": propertyName});
	}
});
