// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.collections === 'undefined'){TapAPI.collections = {};}
// TapAPI Namespace Initialization //

// define tour collection
TapAPI.collections.Tours = Backbone.Collection.extend({
	model: TapAPI.models.Tour,
	localStorage: new Backbone.LocalStorage('tours'),
	selectTour: function(id) { // load data for the selected tour

		if (tap.currentTour == id) return;

		// set the current tour
		tap.currentTour = id;

		// set root stop as the current stop if specified
		if(tap.tours.get(id).get('rootStopRef')) {
			tap.currentStop = tap.tours.get(id).get('rootStopRef').id;
		}

		// create new instance of StopCollection
		tap.tourStops = new TapAPI.collections.Stops(null, id);
		// create new instance of AssetCollection
		tap.tourAssets = new TapAPI.collections.Assets(null, id);

		// load data from local storage
		tap.tourAssets.fetch();
		tap.tourStops.fetch();

		tap.trigger("tap.tour.selected");
	}
});
