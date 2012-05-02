// define tour collection
TapTourCollection = Backbone.Collection.extend({
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
