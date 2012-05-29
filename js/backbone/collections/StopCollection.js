// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.collections === 'undefined'){TapAPI.collections = {};}
// TapAPI Namespace Initialization //

// define stop collection
TapAPI.collections.Stops = Backbone.Collection.extend({
	model: TapAPI.models.Stop,
	initialize: function(models, id) {
		this.localStorage = new Backbone.LocalStorage(id + '-stop');
	},
	// retrieve the stop id of a given key code
	getStopByKeycode: function(key) {
		for(var i = 0; i < this.models.length; i++) {
			if(this.models[i].get('propertySet')) {
				for(var j = 0; j < this.models[i].get('propertySet').length; j++) {
					if(this.models[i].get('propertySet')[j].name == 'code' &&
						this.models[i].get('propertySet')[j].value == key) return this.models[i];
				}
			}
		}
		return false;
	}
});
