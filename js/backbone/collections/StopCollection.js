// define stop collection
TapStopCollection = Backbone.Collection.extend({
	model: TapStopModel,
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
