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
				return getAttributeByLanguage(this.attributes[attr]);
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
