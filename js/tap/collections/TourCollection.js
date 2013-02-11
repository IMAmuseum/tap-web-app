define([
	'underscore',
	'backbone',
	'tap/app',
	'tap/models/TourModel',
	'tap/collections/StopCollection',
	'tap/collections/AssetCollection',
	'localstorage'
], function(_, Backbone, App, TourModel, StopCollection, AssetCollection) {
	var tourCollection = Backbone.Collection.extend({
		model: TourModel,
		localStorage: new Backbone.LocalStorage('tours'),
		selectTour: function(id) {
			if (App.tap.currentTour == id) return;

			// set the current tour
			App.tap.currentTour = id;

			// set root stop as the current stop if specified
			if(tap.tours.get(id).get('rootStopRef')) {
				App.tap.currentStop = App.tap.tours.get(id).get('rootStopRef').id;
			}

			// create new instance of StopCollection
			tap.tourStops = new StopCollection(null, id);
			// create new instance of AssetCollection
			tap.tourAssets = new AssetCollection(null, id);

			// load data from local storage
			App.tap.tourAssets.fetch();
			App.tap.tourStops.fetch();

			Backbone.trigger('tap.tour.selected');
		}
	});
	return tourCollection;
});