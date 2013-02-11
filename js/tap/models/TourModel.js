define([
	'underscore',
	'backbone',
	'tap/app',
	'tap/collections/PropertySetCollection'
], function(_, Backbone, App, PropertySetCollection) {
	var tourModel = Backbone.Model.extend({
		get: function(attr) { // override get method
			if(!this.attributes[attr]) return this.attributes[attr];
			switch(attr) {  // retrieve attribute based on language
				case 'description':
				case 'title':
					if (this.attributes[attr].length === 0) return undefined;

					var value, property;

					property = _.find(this.attributes[attr], function(item) {
						return item.lang === App.tap.language;
					});

					if (!property && App.tap.language !== App.tap.defaultLanguage) {
						property = _.find(this.attributes[attr], function(item) {
							return item.lang === App.tap.defaultLanguage;
						});
					}

					if (!property) {
						property = _.find(this.attributes[attr], function(item) {
							return item.lang === undefined || item.lang === "";
						});
					}

					if (property) {
						value = property.value;
					}

					return value;
				default:
					return this.attributes[attr];
			}
		},
		parse: function(response) {
			response.propertySet = new PropertySetCollection(
				response.propertySet,
				{id: response.id}
			);

			return response;
		}
	});
	return tourModel;
});