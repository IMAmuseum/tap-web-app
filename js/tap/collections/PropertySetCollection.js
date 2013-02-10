// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.collections === 'undefined'){TapAPI.collections = {};}
// TapAPI Namespace Initialization //

// define assett collection
TapAPI.collections.PropertySet = Backbone.Collection.extend({
	model: TapAPI.models.Property,
	initialize: function(models, options) {
		this.localStorage = new Backbone.LocalStorage(options.id + '-propertyset');
	},
	getValueByName: function(propertyName) {
		var property, value;
		property = this.where({"name": propertyName, "lang": tap.language});
		if (property.length === 0) {
			property = this.where({"name": propertyName});
		}
		if (property.length) {
			value = property[0].get('value');
		}
		return value;
	}
});