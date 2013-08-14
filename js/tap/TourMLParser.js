TapAPI.tourMLParser = {
    process: function(url) {
        var tours = [];
        var i, len;

        // load tourML
        var tourML = TapAPI.helper.xmlToJson(TapAPI.helper.loadXMLDoc(url));
        if(tourML.tour) { // Single tour
            tours.push(this.parseTourML(tourML.tour));
        } else if(tourML.tourSet && tourML.tourSet.tourMLRef) { // TourSet w/ external tours
            var tourRefs = TapAPI.helper.objectToArray(tourML.tourSet.tourMLRef);
            len = tourRefs.length;
            for(i = 0; i < len; i++) {
                var data = TapAPI.helper.xmlToJson(TapAPI.helper.loadXMLDoc(tourRefs[i].uri));
                tours.push(this.parseTourML(data.tour, url));
            }
        } else if(tourML.tourSet && tourML.tourSet.tour) { // TourSet w/ tours as children elements
            len = tourML.tourSet.tour.length;
            for(i = 0; i < len; i++) {
               tours.push(this.parseTourML(tourML.tourSet.tour[i], url));
            }
        }

        return tours;
    },
    parseTourML: function(data, toursetUrl) {

        // bind pre and post processing events
        this.on('willParseTour', $.proxy(this.onWillParseTour, this));
        this.on('didParseTour', $.proxy(this.onDidParseTour, this));
        this.on('willParseStop', $.proxy(this.onWillParseStop, this));
        this.on('didParseStop', $.proxy(this.onDidParseStop, this));
        this.on('willParseAsset', $.proxy(this.onWillParseAsset, this));
        this.on('didParseAsset', $.proxy(this.onDidParseAsset, this));

        this.trigger('willParseTour');

        // check to see if the tour has been updated
        var tour = TapAPI.tours.get(data.id);
        if (tour && Date.parse(data.lastModified) <= Date.parse(tour.get('lastModified'))) return tour;

        var stops = [],
            assets = [];

        // create new tour
        tour = new TapAPI.classes.models.TourModel({
            id: data.id,
            toursetUrl: toursetUrl,
            appResource: data.tourMetadata && data.tourMetadata.appResource ? TapAPI.helper.objectToArray(data.tourMetadata.appResource) : undefined,
            connection: data.connection ? TapAPI.helper.objectToArray(data.connection) : undefined,
            description: data.tourMetadata && data.tourMetadata.description ? TapAPI.helper.objectToArray(data.tourMetadata.description) : undefined,
            lastModified: data.lastModified ? data.lastModified : undefined,
            propertySet: data.tourMetadata && data.tourMetadata.propertySet ? TapAPI.helper.objectToArray(data.tourMetadata.propertySet.property) : undefined,
            publishDate: data.tourMetadata && data.tourMetadata.publishDate ? TapAPI.helper.objectToArray(data.tourMetadata.publishDate) : undefined,
            rootStopRef: data.tourMetadata && data.tourMetadata.rootStopRef ? data.tourMetadata.rootStopRef : undefined,
            title: data.tourMetadata && data.tourMetadata.title ? TapAPI.helper.objectToArray(data.tourMetadata.title) : undefined
        });
        TapAPI.tours.create(tour);

        // create new instance of StopCollection
        var stopCollection = new TapAPI.classes.collections.StopCollection(null, data.id);
        // create new instance of AssetCollection
        var assetCollection = new TapAPI.classes.collections.AssetCollection(null, data.id);

        var i, j;
        // load tour models
        var connectionData = TapAPI.helper.objectToArray(data.connection);
        data.stop = TapAPI.helper.objectToArray(data.stop);
        var numStops = data.stop.length;
        for (i = 0; i < numStops; i++) {
            this.trigger('willParseStop');
            var stop,
                connections = [];

            if(!_.isUndefined(data.connection)) {
                for(j = 0; j < connectionData.length; j++) {
                    if(connectionData[j].srcId == data.stop[i].id) {
                        connections.push({priority: connectionData[j].priority, destId: connectionData[j].destId});
                    }
                }
            }
            
            stop = new TapAPI.classes.models.StopModel({
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
            this.trigger('didParseStop', stop);
        }

        // load asset models
        data.asset = TapAPI.helper.objectToArray(data.asset);
        var numAssets = data.asset.length;
        for (i = 0; i < numAssets; i++) {
            this.trigger('willParseAsset');
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

            asset = new TapAPI.classes.models.AssetModel({
                assetRights: TapAPI.helper.objectToArray(data.asset[i].assetRights),
                content: data.asset[i].content,
                id: data.asset[i].id,
                source: data.asset[i].source,
                propertySet: data.asset[i].propertySet ? TapAPI.helper.objectToArray(data.asset[i].propertySet.property) : undefined,
                type: data.asset[i].type
            });
            assetCollection.create(asset);
            assets.push(asset);
            this.trigger('didParseAsset', asset);
        }

        // clear out the temporary models
        stopCollection.reset();
        assetCollection.reset();

        // attempt to fetch existing models.
        stopCollection.fetch();
        assetCollection.fetch();

        // create/update new stops and assets
        stopCollection.set(stops);
        assetCollection.set(assets);

        // clear out the temporary models
        stopCollection.reset();
        assetCollection.reset();
        
        // announce we're done parsing the tour
        this.trigger('didParseTour', tour);
        
        return tour;
    },
    
    // stubs for local parse event handlers
    onWillParseTour: (TapConfig.willParseTour) ? TapConfig.willParseTour : function () {},
    onDidParseTour: (TapConfig.didParseTour) ? TapConfig.didParseTour : function (tour) {},
    onWillParseStop: (TapConfig.willParseStop) ? TapConfig.willParseStop : function () {},
    onDidParseStop: (TapConfig.didParseStop) ? TapConfig.didParseStop : function (stop) {},
    onWillParseAsset: (TapConfig.willParseAsset) ? TapConfig.willParseAsset : function () {},
    onDidParseAsset: (TapConfig.didParseAsset) ? TapConfig.didParseAsset : function (asset) {}
};

_.extend(TapAPI.tourMLParser, Backbone.Events);