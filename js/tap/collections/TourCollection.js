/*
 * Backbone colleciton for managing Tours
 */
TapAPI.classes.collections.tourCollection = Backbone.Collection.extend({
    model: TapAPI.classes.models.TourModel,
    localStorage: new Backbone.LocalStorage('tours'),
    syncTourML: function(url) {
        var tours = [],
            tourML, i, len;

        // populate the tour collection
        this.fetch();

        // load tourML
        tourML = TapAPI.helper.xmlToJson(TapAPI.helper.loadXMLDoc(url));
        if(tourML.tour) { // Single tour
            tours.push(this.parseTourML(tourML.tour));
        } else if(tourML.tourSet && tourML.tourSet.tourMLRef) { // TourSet w/ external tours
            var tourRefs = TapAPI.helper.objectToArray(tourML.tourSet.tourMLRef);
            len = tourRefs.length;
            for(i = 0; i < len; i++) {
                var data = TapAPI.helper.xmlToJson(TapAPI.helper.loadXMLDoc(tourRefs[i].uri));
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
        tour = new TapAPI.classes.models.tourModel({
            id: data.id,
            appResource: data.tourMetadata && data.tourMetadata.appResource ? TapAPI.helper.objectToArray(data.tourMetadata.appResource) : undefined,
            connection: data.connection ? TapAPI.helper.objectToArray(data.connection) : undefined,
            description: data.tourMetadata && data.tourMetadata.description ? TapAPI.helper.objectToArray(data.tourMetadata.description) : undefined,
            lastModified: data.tourMetadata && data.tourMetadata.lastModified ? data.tourMetadata.lastModified : undefined,
            propertySet: data.tourMetadata && data.tourMetadata.propertySet ? TapAPI.helper.objectToArray(data.tourMetadata.propertySet.property) : undefined,
            publishDate: data.tourMetadata && data.tourMetadata.publishDate ? TapAPI.helper.objectToArray(data.tourMetadata.publishDate) : undefined,
            rootStopRef: data.tourMetadata && data.tourMetadata.rootStopRef ? data.tourMetadata.rootStopRef : undefined,
            title: data.tourMetadata && data.tourMetadata.title ? TapAPI.helper.objectToArray(data.tourMetadata.title) : undefined
        });
        this.create(tour);

        // create new instance of StopCollection
        var stopCollection = new TapAPI.classes.collections.stopCollection(null, data.id);
        // create new instance of AssetCollection
        var assetCollection = new TapAPI.classes.collections.assetCollection(null, data.id);

        var i, j;
        // load tour models
        var connectionData = TapAPI.helper.objectToArray(data.connection);
        data.stop = TapAPI.helper.objectToArray(data.stop);
        var numStops = data.stop.length;
        for (i = 0; i < numStops; i++) {
            var stop,
                connections = [];

            if(!_.isUndefined(data.connection)) {
                for(j = 0; j < connectionData.length; j++) {
                    if(connectionData[j].srcId == data.stop[i].id) {
                        connections.push({priority: connectionData[j].priority, destId: connectionData[j].destId});
                    }
                }
            }

            stop = new TapAPI.classes.models.stopModel({
                id: data.stop[i].id,
                connection: connections,
                view: data.stop[i].view,
                description: TapAPI.helper.objectToArray(data.stop[i].description),
                propertySet: data.stop[i].propertySet ? TapAPI.helper.objectToArray(data.stop[i].propertySet.property) : undefined,
                assetRef: TapAPI.helper.objectToArray(data.stop[i].assetRef),
                title: TapAPI.helper.objectToArray(data.stop[i].title),
                tour: data.id
            });
            stopCollection.create(stop);
            stops.push(stop);
        }

        // load asset models
        data.asset = TapAPI.helper.objectToArray(data.asset);
        var numAssets = data.asset.length;
        for (i = 0; i < numAssets; i++) {
            var asset;

            // modifiy source propertySet child to match similar elements
            if(data.asset[i].source) {
                data.asset[i].source = TapAPI.helper.objectToArray(data.asset[i].source);
                var numSources = data.asset[i].source.length;
                for (j = 0; j < numSources; j++) {
                    if(data.asset[i].source[j].propertySet) {
                        data.asset[i].source[j].propertySet = TapAPI.helper.objectToArray(data.asset[i].source[j].propertySet.property);
                    }
                }
            }
            if(data.asset[i].content) {
                data.asset[i].content = TapAPI.helper.objectToArray(data.asset[i].content);
                var numContent = data.asset[i].content.length;
                for (j = 0; j < numContent; j++) {
                    if(data.asset[i].content[j].propertySet) {
                        data.asset[i].content[j].propertySet = TapAPI.helper.objectToArray(data.asset[i].content[j].propertySet.property);
                    }
                }
            }

            asset = new TapAPI.classes.models.assetModel({
                assetRights: TapAPI.helper.objectToArray(data.asset[i].assetRights),
                content: data.asset[i].content,
                id: data.asset[i].id,
                source: data.asset[i].source,
                propertySet: data.asset[i].propertySet ? TapAPI.helper.objectToArray(data.asset[i].propertySet.property) : undefined,
                type: data.asset[i].type
            });
            assetCollection.create(asset);
            assets.push(asset);
        }

        // clear out the temporary models
        stopCollection.reset();
        assetCollection.reset();

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
        TapAPI.tourStops = new TapAPI.classes.collections.stopCollection(null, tourID);
        // create new instance of AssetCollection
        TapAPI.tourAssets = new TapAPI.classes.collections.assetCollection(null, tourID);

        // load data from local storage
        TapAPI.tourAssets.fetch();
        TapAPI.tourStops.fetch();

        Backbone.trigger('tap.tour.selected');
    }
});
