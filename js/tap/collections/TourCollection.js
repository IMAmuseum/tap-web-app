define([
    'underscore',
    'backbone',
    'tap/helper',
    'tap/TapAPI',
    'tap/models/TourModel',
    'tap/models/StopModel',
    'tap/models/AssetModel',
    'tap/collections/StopCollection',
    'tap/collections/AssetCollection',
    'localstorage'
], function(_, Backbone, Helper, TapAPI, TourModel, StopModel, AssetModel, StopCollection, AssetCollection) {
    var tourCollection = Backbone.Collection.extend({
        model: TourModel,
        localStorage: new Backbone.LocalStorage('tours'),
        syncTourML: function(url) {
            var tours = [],
                tourML, i, len;

            // populate the tour collection
            this.fetch();

            // load tourML
            tourML = Helper.xmlToJson(Helper.loadXMLDoc(url));
            if(tourML.tour) { // Single tour
                tours.push(this.parseTourML(tourML.tour));
            } else if(tourML.tourSet && tourML.tourSet.tourRef) { // TourSet w/ external tours
                len = tourML.tourSet.tourRef.length;
                for(i = 0; i < len; i++) {
                    var data = Helper.xmlToJson(Helper.loadXMLDoc(tourML.tourSet.tourRef[i].uri));
                    tours.push(this.parseTourML(data.tour));
                }
            } else if(tourML.tourSet && tourML.tourSet.tour) { // TourSet w/ tours as children elements
                len = tourML.tourSet.tour.length;
                for(i = 0; i < len; i++) {
                   tours.push(this.parseTourML(tourML.tourSet.tour[i]));
                }
            }

            this.update(tours);
        },
        parseTourML: function(data) {
            // check to see if the tour has been updated
            var tour = this.get(data.id);
            if (tour && Date.parse(data.lastModified) <= Date.parse(tour.get('lastModified'))) return tour;

            var stops = [],
                assets = [];

            // create new tour
            tour = new TourModel({
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
                var stop,
                    connections = [];

                if(!_.isUndefined(data.connection)) {
                    for(j = 0; j < data.connection.length; j++) {
                        if(data.connection[j].srcId == data.stop[i].id) {
                            connections.push({priority: data.connection[j].priority, destId: data.connection[j].destId});
                        }
                    }
                }

                stop = new StopModel({
                    id: data.stop[i].id,
                    connection: connections,
                    view: data.stop[i].view,
                    description: Helper.objectToArray(data.stop[i].description),
                    propertySet: data.stop[i].propertySet ? Helper.objectToArray(data.stop[i].propertySet.property) : undefined,
                    assetRef: Helper.objectToArray(data.stop[i].assetRef),
                    title: Helper.objectToArray(data.stop[i].title),
                    tour: data.id
                });
                stops.push(stop);
            }

            // load asset models
            var numAssets = data.asset.length;
            for (i = 0; i < numAssets; i++) {
                var asset;

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

                asset = new AssetModel({
                    assetRights: Helper.objectToArray(data.asset[i].assetRights),
                    content: data.asset[i].content,
                    id: data.asset[i].id,
                    source: data.asset[i].source,
                    propertySet: data.asset[i].propertySet ? Helper.objectToArray(data.asset[i].propertySet.property) : undefined,
                    type: data.asset[i].type
                });
                assets.push(asset);
            }

            // create new instance of StopCollection
            var stopCollection = new StopCollection(null, data.id);
            // create new instance of AssetCollection
            var assetCollection = new AssetCollection(null, data.id);

            // attempt to fetch existing models.
            stopCollection.fetch();
            assetCollection.fetch();

            // create/update new stops and assets
            stopCollection.update(stops);
            assetCollection.update(assets);

            // clear out the temporary models
            stopCollection.reset();
            assetCollection.reset();

            return tour;
        },
        selectTour: function(tourID) {
            if (TapAPI.currentTour == tourID) return;

            if (!TapAPI.tours.get(tourID)) {
                console.log('Unable to load tour.');
                return;
            }

            // set the current tour
            TapAPI.currentTour = tourID;

            // set root stop as the current stop if specified
            if(TapAPI.tours.get(tourID).get('rootStopRef')) {
                TapAPI.currentStop = TapAPI.tours.get(tourID).get('rootStopRef').id;
            }

            // create new instance of StopCollection
            TapAPI.tourStops = new StopCollection(null, tourID);
            // create new instance of AssetCollection
            TapAPI.tourAssets = new AssetCollection(null, tourID);

            // load data from local storage
            TapAPI.tourAssets.fetch();
            TapAPI.tourStops.fetch();

            Backbone.trigger('tap.tour.selected');
        }
    });
    return tourCollection;
});