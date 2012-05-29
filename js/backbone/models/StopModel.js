// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.models === 'undefined'){TapAPI.models = {};}
// TapAPI Namespace Initialization //

// define stop model
TapAPI.models.Stop = Backbone.Model.extend({
	get: function(attr) { // override get method
		if(!this.attributes[attr]) return this.attributes[attr];
		switch(attr) {  // retrieve attribute based on language
			case 'tourMetadata':
			case 'propertySet':
			case 'description':
			case 'title':
				return getAttributeByLanguage(this.attributes[attr]);
			default:
				return this.attributes[attr];
		}
	}
});
