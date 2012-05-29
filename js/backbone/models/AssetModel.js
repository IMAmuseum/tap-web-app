// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.models === 'undefined'){TapAPI.models = {};}
// TapAPI Namespace Initialization //

// define asset model
TapAPI.models.Asset = Backbone.Model.extend({
	get: function(attr) { // override get method
		if(!this.attributes[attr]) return this.attributes[attr];
		switch(attr) { // retrieve attribute based on language
			case 'tourMetadata':
			case 'propertySet':
			case 'source':
			case 'content':
				return getAttributeByLanguage(objectToArray(this.attributes[attr]));
			default:
				return this.attributes[attr];
		}
	}
});
