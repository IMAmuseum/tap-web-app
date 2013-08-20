TapAPI.tourMLParser = {
    initialized: false,
    initialize: function() {
        // bind pre and post processing events
        this.on('willParseTour', $.proxy(this.onWillParseTour, this));
        this.on('didParseTour', $.proxy(this.onDidParseTour, this));
        this.on('willParseStop', $.proxy(this.onWillParseStop, this));
        this.on('didParseStop', $.proxy(this.onDidParseStop, this));
        this.on('willParseAsset', $.proxy(this.onWillParseAsset, this));
        this.on('didParseAsset', $.proxy(this.onDidParseAsset, this));

        this.tourMap = {};

        this.listenTo(Backbone, 'tap.tourml.loaded', this.parseTourML);

        this.initialized = true;
    },
    process: function(uri) {
        if (!this.initialized) {
            this.initialize();
        }

        // load tourML
        TapAPI.helper.loadXMLDoc(uri);
    },
    parseTourML: function(tourML) {
        var tours = [];
        if(tourML.tour) { // Single tour
            this.addTourToMap(tourML.uri);
            tours.push(this.parseTour(tourML.tour, tourML.uri));
        } else if(tourML.tourSet && tourML.tourSet.tourMLRef) { // TourSet w/ external tours
            var tourRefs = TapAPI.helper.objectToArray(tourML.tourSet.tourMLRef);
            len = tourRefs.length;
            for(i = 0; i < len; i++) {
                this.addTourToMap(tourRefs[i].uri, tourML.uri);
                //check modified date before requesting tourml from server
                var tour = TapAPI.tours.where({tourUri:tourRefs[i].uri});
                if (tour.length > 0 && Date.parse(tourRefs[i].lastModified) <= Date.parse(tour[0].get('lastModified'))) {
                    tours.push(tour[0]);
                } else {
                    TapAPI.helper.loadXMLDoc(tourRefs[i].uri);
                }
            }
        } else if(tourML.tourSet && tourML.tourSet.tour) { // TourSet w/ tours as children elements
            len = tourML.tourSet.tour.length;
            for(i = 0; i < len; i++) {
               tours.push(this.parseTour(tourML.tourSet.tour[i], tourML.uri));
            }
        }
        Backbone.trigger('tap.tourml.parsed', tours);
    },
    parseTour: function(data, tourUri) {
        this.trigger('willParseTour');

        var toursetUri = this.tourMap[tourUri];

        // check to see if the tour has been updated
        var tour = TapAPI.tours.get(data.id);
        if (tour && Date.parse(data.lastModified) <= Date.parse(tour.get('lastModified'))) return tour;

        var stops = [],
            assets = [];

        // create new tour
        tour = new TapAPI.classes.models.TourModel({
            id: data.id,
            toursetUri: toursetUri,
            tourUri: tourUri,
            appResource: data.tourMetadata && data.tourMetadata.appResource ? TapAPI.helper.objectToArray(data.tourMetadata.appResource) : undefined,
            connection: data.connection ? TapAPI.helper.objectToArray(data.connection) : undefined,
            description: data.tourMetadata && data.tourMetadata.description ? TapAPI.helper.objectToArray(data.tourMetadata.description) : undefined,
            lastModified: data.lastModified ? data.lastModified : undefined,
            propertySet: data.tourMetadata && data.tourMetadata.propertySet ? TapAPI.helper.objectToArray(data.tourMetadata.propertySet.property) : undefined,
            publishDate: data.tourMetadata && data.tourMetadata.publishDate ? TapAPI.helper.objectToArray(data.tourMetadata.publishDate) : undefined,
            rootStopRef: data.tourMetadata && data.tourMetadata.rootStopRef ? data.tourMetadata.rootStopRef : undefined,
            title: data.tourMetadata && data.tourMetadata.title ? TapAPI.helper.objectToArray(data.tourMetadata.title) : undefined
        });
        //TapAPI.tours.create(tour);

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

    addTourToMap: function(tourUri, tourSetUri) {
        if (_.isUndefined(this.tourMap[tourUri])) {
            this.tourMap[tourUri] = [];
        }

        if (!_.isUndefined(tourSetUri)) {
            this.tourMap[tourUri].push(tourSetUri);
        }
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