define([
	'underscore',
	'backbone',
	'tap/TapAPI',
	'tap/models/PropertyModel',
	'localstorage'
], function(_, Backbone, TapAPI, PropertyModel) {
	var propertySetCollection = Backbone.Collection.extend({
		model: PropertyModel,
		initialize: function(models, options) {
			this.localStorage = new Backbone.LocalStorage(options.id + '-propertyset');
		},
		getValueByName: function(propertyName) {
			var property, value;
			property = this.where({"name": propertyName, "lang": TapAPI.language});
			if (property.length === 0) {
				property = this.where({"name": propertyName});
			}
			if (property.length) {
				value = property[0].get('value');
			}
			return value;
		}
	});
	return  propertySetCollection;
});