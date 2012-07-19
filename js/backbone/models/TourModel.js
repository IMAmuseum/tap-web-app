// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.models === 'undefined'){TapAPI.models = {};}
// TapAPI Namespace Initialization //

// define tour model
TapAPI.models.Tour = Backbone.Model.extend({
	get: function(attr) { // override get method
		if(!this.attributes[attr]) return this.attributes[attr];
		switch(attr) {  // retrieve attribute based on language
			case 'description':
			case 'title':
				if (this.attributes[attr].length === 0) return undefined;
				var value, property;
				property = _.find(this.attributes[attr], function(item) {
					return item.lang === tap.language;
				});
				if (!property) {
					property = _.find(this.attributes[attr], function(item) {
						return item.lang === tap.defaultLanguage;
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
		response.propertySet = new TapAPI.collections.PropertySet(
			response.propertySet,
			this.id
		);

		return response;
	}
});