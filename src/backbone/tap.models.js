// define tour model
var TapTourModel = Backbone.Model.extend({
	get: function(attr) { // override get method
		if(!this.attributes[attr]) return this.attributes[attr];
		switch(attr) {  // retrieve attribute based on language
			case 'propertySet':
			case 'description':				
			case 'title':
				return getAttributeByLanguage(this.attributes[attr]);
			default:
				return this.attributes[attr];
		}
	}
});

// define tour collection
var TapTourCollection = Backbone.Collection.extend({
	model: TapTourModel,
	localStorage: new Store('tours'),
	selectTour: function(id) { // load data for the selected tour
		// set the current tour
		tap.currentTour = id;

		// set root stop as the current stop if specified
		if(tap.tours.get(id).get('rootStopRef')) {
			tap.currentStop = tap.tours.get(id).get('rootStopRef').id;
		}

		// create new instance of StopCollection
		tap.tourStops = new TapStopCollection(null, id);
		// create new instance of AssetCollection
		tap.tourAssets = new TapAssetCollection(null, id);	

		// load data from local storage
		tap.tourStops.fetch();
		tap.tourAssets.fetch();
	}
});
	
// define stop model
var TapStopModel = Backbone.Model.extend({
	get: function(attr) { // override get method
		if(!this.attributes[attr]) return this.attributes[attr];			
		switch(attr) {  // retrieve attribute based on language
			case 'propertySet':
			case 'description':				
			case 'title':
				return getAttributeByLanguage(this.attributes[attr]);
			default:
				return this.attributes[attr];
		}
	}
});

// define stop collection
var TapStopCollection = Backbone.Collection.extend({
	model: TapStopModel,
	initialize: function(models, id) {
		this.localStorage = new Store(id + '-stop');
	},
	// retrieve the stop id of a given key code
	getStopByKeycode: function(key) {
		for(var i = 0; i < this.models.length; i++) {
			if(this.models[i].get('propertySet')) {
				for(var j = 0; j < this.models[i].get('propertySet').length; j++) {
					if(this.models[i].get('propertySet')[j].name == 'code' &&
						this.models[i].get('propertySet')[j].value == key) return this.models[i].id;
				}
			} 
		}
		return false;
	}
});

// define asset model
var TapAssetModel = Backbone.Model.extend({
	get: function(attr) { // override get method
		if(!this.attributes[attr]) return this.attributes[attr];
		switch(attr) { // retrieve attribute based on language
			case 'propertySet':			
			case 'source':
			case 'content':
				return getAttributeByLanguage(objectToArray(this.attributes[attr]));
			default:
				return this.attributes[attr];
		}
	}
});

// define assett collection
var TapAssetCollection = Backbone.Collection.extend({
	model: TapAssetModel,
	initialize: function(models, id) {
		this.localStorage = new Store(id + '-asset');
	}
});