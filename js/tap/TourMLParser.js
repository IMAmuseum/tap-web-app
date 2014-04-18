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
        this.tourOrder = [];

        this.listenTo(Backbone, 'tap.tourml.loaded', this.parseTourML);
        this.listenTo(Backbone, 'tap.tourml.loadingerror', this.parseTourMLError);

        this.initialized = true;
    },
    process: function(uri) {
        if (!this.initialized) {
            this.initialize();
        }

        // increment counter to keep track
        // of how much async work is left to do
        TapAPI.tours.tourmlRequests++;

        // load tourML
        TapAPI.helper.loadXMLDoc(uri);
    },
    parseTourML: function(tourML) {
        var tours = [];
        var tour;
        if(tourML.tour) { // Single tour
            this.addTourToMap(tourML.uri);
            tour = this.parseTour(tourML.tour, tourML.uri);
            if (!_.isUndefined(tour)) {
                tours.push(tour);
            }
        } else if(tourML.tourSet && tourML.tourSet.tourMLRef) { // TourSet w/ external tours
            var tourRefs = TapAPI.helper.objectToArray(tourML.tourSet.tourMLRef);
            len = tourRefs.length;
            // TapAPI.tours.toursToParse += len;// if this is a tourset give the tour collection a length
            for(i = 0; i < len; i++) {
                this.addTourToMap(tourRefs[i].uri, tourML.uri);
                //check modified date before requesting tourml from server
                tour = TapAPI.tours.cache.where({tourUri:tourRefs[i].uri});
                if (tour.length > 0 && Date.parse(tourRefs[i].lastModified) <= Date.parse(tour[0].get('lastModified'))) {
                    tours.push(tour[0]);
                } else {
                    // also increment async counter
                    TapAPI.tours.tourmlRequests++;
                    TapAPI.helper.loadXMLDoc(tourRefs[i].uri);
                }
            }
        } else if(tourML.tourSet && tourML.tourSet.tour) { // TourSet w/ tours as children elements
            len = tourML.tourSet.tour.length;
            for(i = 0; i < len; i++) {
                tour = this.parseTour(tourML.tourSet.tour[i], tourML.uri);
                if (!_.isUndefined(tour)) {
                    tours.push(tour);
                }
            }
        }
        // decrement async counter
        TapAPI.tours.tourmlRequests--;
        Backbone.trigger('tap.tourml.parsed', tours);
    },
    parseTourMLError : function (response) {
        TapAPI.tours.tourmlRequests--;
        Backbone.trigger('tap.tourml.parsed', []);
    },
    parseTour: function(data, tourUri) {
        this.trigger('willParseTour');

        var toursetUri = this.tourMap[tourUri];
        var tourOrder = _.indexOf(this.tourOrder, tourUri);

        // check to see if the tour has been updated
        var tour = TapAPI.tours.cache.get(data.id);
        if (tour && Date.parse(data.lastModified) <= Date.parse(tour.get('lastModified'))) return tour;

        var stops = [],
            assets = [];

        //clean stop data for consistant formatting
        data.stop = TapAPI.helper.objectToArray(data.stop);
        //if no stops do not continue with this tour
        if (_.isUndefined(data.stop)) {
            return undefined;
        }

        // create new tour
        tour = new TapAPI.classes.models.TourModel({
            id: data.id,
            toursetUri: toursetUri,
            tourUri: tourUri,
            tourOrder: tourOrder,
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
        var numStops = data.stop.length;
        for (i = 0; i < numStops; i++) {
            this.trigger('willParseStop');
            var stop,
                outgoingConnections = [],
                incomingConnections = [];

            if(!_.isUndefined(data.connection)) {
                for(j = 0; j < connectionData.length; j++) {
                    if(connectionData[j].srcId == data.stop[i].id) {
                        outgoingConnections.push({priority: connectionData[j].priority, destId: connectionData[j].destId});
                    }
                    if (connectionData[j].destId == data.stop[i].id) {
                        incomingConnections.push({srcId: connectionData[j].srcId});
                    }
                }
            }

            stop = new TapAPI.classes.models.StopModel({
                id: data.stop[i].id,
                connection: outgoingConnections,
                incomingConnection: incomingConnections,
                view: data.stop[i].view,
                description: TapAPI.helper.objectToArray(data.stop[i].description),
                propertySet: data.stop[i].propertySet ? TapAPI.helper.objectToArray(data.stop[i].propertySet.property) : undefined,
                assetRef: TapAPI.helper.objectToArray(data.stop[i].assetRef),
                title: TapAPI.helper.objectToArray(data.stop[i].title),
                tour: data.id
            });
            stopCollection.create(stop);
            stops.push(stop);
            this.trigger('didParseStop', stop, tour);
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
            this.trigger('didParseAsset', asset, tour);
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

        if (_.indexOf(this.tourOrder, tourUri) === -1) {
            this.tourOrder.push(tourUri);
        }
    },

    // stubs for local parse event handlers
    onWillParseTour: (TapConfig.willParseTour) ? TapConfig.willParseTour : function () {},
    onDidParseTour: (TapConfig.didParseTour) ? TapConfig.didParseTour : function (tour) {},
    onWillParseStop: (TapConfig.willParseStop) ? TapConfig.willParseStop : function () {},
    onDidParseStop: (TapConfig.didParseStop) ? TapConfig.didParseStop : function (stop, tour) {},
    onWillParseAsset: (TapConfig.willParseAsset) ? TapConfig.willParseAsset : function () {},
    onDidParseAsset: (TapConfig.didParseAsset) ? TapConfig.didParseAsset : function (asset, tour) {}
};

_.extend(TapAPI.tourMLParser, Backbone.Events);