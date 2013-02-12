define([
    'jquery',
    'underscore',
    'backbone',
    'tap/router',
    'tap/app',
    'tap/settings',
    'tap/helper',
    'tap/collections/TourCollection',
    'tap/collections/StopCollection',
    'tap/collections/AssetCollection'
], function($, _, Backbone, Router, App, Settings, Helper, TourCollection, StopCollecton, AssetCollection) {
	var appView = Backbone.View.extend({
		initialize: function() {
			Backbone.trigger('tap.init.start');

            // get browser language
            var browserLanguage = (navigator.language) ? navigator.language : navigator.userLanguage;
            App.tap.language = browserLanguage.split('-')[0];

            // create new instance of tour collection
            App.tap.tours = new TourCollection();

            App.tap.tours.fetch();

            // load tourML
            var tourML = Helper.xmlToJson(Helper.loadXMLDoc(Settings.url));
            var i, len;
            if(tourML.tour) { // Single tour
                this.initModels(tourML.tour);
            } else if(tourML.tourSet && tourML.tourSet.tourRef) { // TourSet w/ external tours
                len = tourML.tourSet.tourRef.length;
                for(i = 0; i < len; i++) {
                    var data = Helper.xmlToJson(Helper.loadXMLDoc(tourML.tourSet.tourRef[i].uri));
                    this.initModels(data.tour);
                }
            } else if(tourML.tourSet && tourML.tourSet.tour) { // TourSet w/ tours as children elements
                len = tourML.tourSet.tour.length;
                for(i = 0; i < len; i++) {
                    this.initModels(tourML.tourSet.tour[i]);
                }
            }
            // trigger tap init end event
            Backbone.trigger('tap.init.end');

            // initialize router
           App.router = new Router();
		},
		initModels: function(data) {
			// check to see if the tour has been updated
			var tour = App.tap.tours.get(data.id);
			if (tour && Date.parse(data.lastModified) <= Date.parse(tour.get('lastModified'))) return;

			// create new instance of StopCollection
			var stops = new StopCollecton(null, data.id);
			// create new instance of AssetCollection
			var assets = new AssetCollection(null, data.id);

			// remove existing models for this tour
			if (App.tap.tours.get(data.id)) {
				App.tap.tours.get(data.id).destroy();
				stops.fetch();
				stops.each(function(stop) {
					stop.destroy();
				});
				assets.fetch();
				assets.each(function(asset) {
					asset.destroy();
				});
			}

			Backbone.trigger('tap.init.create-tour', {id: data.id});

			// create new tour
			App.tap.tours.create({
				id: data.id,
				appResource: data.tourMetadata && data.tourMetadata.appResource ? Helper.objectToArray(data.tourMetadata.appResource) : undefined,
				connection: data.connection ? Helper.objectToArray(data.connection) : undefined,
				description: data.tourMetadata && data.tourMetadata.description ? Helper.objectToArray(data.tourMetadata.description) : undefined,
				lastModified: data.tourMetadata && data.tourMetadata.lastModified ? data.tourMetadata.lastModified : undefined,
				propertySet: data.tourMetadata && data.tourMetadata.propertySet ? Helper.objectToArray(data.tourMetadata.propertySet.property) : undefined,
				publishDate: data.tourMetadata && data.tourMetadata.publishDate ? Helper.objectToArray(data.tourMetadata.publishDate) : undefined,
				rootStopRef: data.tourMetadata && data.tourMetadata.rootStopRef ? data.tourMetadata.rootStopRef : undefined,
				title: data.tourMetadata && data.tourMetadata.title ? Helper.objectToArray(data.tourMetadata.title) : undefined
			});

			var i, j;
			// load tour models
			var numStops = data.stop.length;
			for (i = 0; i < numStops; i++) {
				var connections = [];
				if(!_.isUndefined(data.connection)) {
					for(j = 0; j < data.connection.length; j++) {
						if(data.connection[j].srcId == data.stop[i].id) {
							connections.push({priority: data.connection[j].priority, destId: data.connection[j].destId});
						}
					}
				}

				stops.create({
					id: data.stop[i].id,
					connection: connections,
					view: data.stop[i].view,
					description: Helper.objectToArray(data.stop[i].description),
					propertySet: data.stop[i].propertySet ? Helper.objectToArray(data.stop[i].propertySet.property) : undefined,
					assetRef: Helper.objectToArray(data.stop[i].assetRef),
					title: Helper.objectToArray(data.stop[i].title),
					tour: data.id
				});
			}

			// load asset models
			var numAssets = data.asset.length;
			for (i = 0; i < numAssets; i++) {
				// modifiy source propertySet child to match similar elements
				if(data.asset[i].source) {
					data.asset[i].source = Helper.objectToArray(data.asset[i].source);
					var numSources = data.asset[i].source.length;
					for (j = 0; j < numSources; j++) {
						if(data.asset[i].source[j].propertySet) {
							data.asset[i].source[j].propertySet = Helper.objectToArray(data.asset[i].source[j].propertySet.property);
						}
					}
				}
				if(data.asset[i].content) {
					data.asset[i].content = Helper.objectToArray(data.asset[i].content);
					var numContent = data.asset[i].content.length;
					for (j = 0; j < numContent; j++) {
						if(data.asset[i].content[j].propertySet) {
							data.asset[i].content[j].propertySet = Helper.objectToArray(data.asset[i].content[j].propertySet.property);
						}
					}
				}

				assets.create({
					assetRights: Helper.objectToArray(data.asset[i].assetRights),
					content: data.asset[i].content,
					id: data.asset[i].id,
					source: data.asset[i].source,
					propertySet: data.asset[i].propertySet ? Helper.objectToArray(data.asset[i].propertySet.property) : undefined,
					type: data.asset[i].type
				});
			}
			// clear out the temporary models
			stops.reset();
			assets.reset();
		}
	});
	return new appView();
});