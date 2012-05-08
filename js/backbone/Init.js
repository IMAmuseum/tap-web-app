if (!tap) {
	var tap = {};
	tap.tours = {};
	tap.tourAssets = {};
	tap.tourStops = {}; // initialize tour stop
	tap.language = 'en'; // set default language
	tap.currentStop = ''; // id of the current stop
	tap.currentTour = ''; // id of the current tour

	_.extend(tap, Backbone.Events);
	/*
	 * Takes care of storing/loading data in local storage and initializing
	 * the tour collection.
	 */
	tap.initApp = function() {
		// trigger tap init start event
		tap.trigger('tap.init.start');

		// create new instance of tour collection
		tap.tours = new TapTourCollection();

		tap.tours.fetch();

		// populate local storage if this is a first run
		if(!tap.tours.length) {
			// load tourML
			var tourML = xmlToJson(loadXMLDoc(tap.url));
			var i, len;
			if(tourML.tour) { // Single tour
				tap.initModels(tourML.tour);
			} else if(tourML.tourSet && tourML.tourSet.tourRef) { // TourSet w/ external tours
				len = tourML.tourSet.tourRef.length;
				for(i = 0; i < len; i++) {
					var data = xmlToJson(loadXMLDoc(tourML.tourSet.tourRef[i].uri));
					tap.initModels(data.tour);
				}
			} else if(tourML.tourSet && tourML.tourSet.tour) { // TourSet w/ tours as children elements
				len = tourML.tourSet.tour.length;
				for(i = 0; i < len; i++) {
					tap.initModels(tourML.tourSet.tour[i]);
				}
			}
		}
		// trigger tap init end event
		tap.trigger('tap.init.end');
	};
    
	/*
	 * Initialize models with data
	 */
	tap.initModels = function(data) {
		// create new tour
		tap.tours.create({
			id: data.id,
			//appResource: data.tourMetadata && data.tourMetadata.appResource ? objectToArray(data.tourMetadata.appResource) : undefined,
			appResource: objectToArray(data.appResource),
			connection: objectToArray(data.connection),
			//description: data.tourMetadata && data.tourMetadata.description ? objectToArray(data.tourMetadata.description) : undefined,
			//lastModified: data.tourMetadata && data.tourMetadata.lastModified ? data.tourMetadata.lastModified : undefined,
			//propertySet: data.tourMetadata && data.tourMetadata.propertySet ? objectToArray(data.tourMetadata.property) : undefined,
			//publishDate: data.tourMetadata && data.tourMetadata.publishDate ? objectToArray(data.tourMetadata.publishDate) : undefined,
			//rootStopRef: data.tourMetadata && data.tourMetadata.rootStopRef ? data.tourMetadata.rootStopRef : undefined,
			//title: data.tourMetadata && data.tourMetadata.title ? objectToArray(data.tourMetadata.title) : undefined,
			description: objectToArray(data.description),
			lastModified: data.lastModified,
			propertySet: objectToArray(data.propertySet.property),
			publishDate: objectToArray(data.publishDate),
			rootStopRef: objectToArray(data.rootStopRef),
			title: objectToArray(data.title)
		});

		var i, j;
		// create new instance of StopCollection
		var stops = new TapStopCollection(null, data.id);
		// load tour models
		var numStops = data.stop.length;
		for (i = 0; i < numStops; i++) {
			var connections = [];
			var numConnections = data.connection.length;
			for(j = 0; j < numConnections; j++) {
				if(data.connection[j].srcId == data.stop[i].id) {
					connections.push({priority: data.connection[j].priority, destId: data.connection[j].destId});
				}
			}
			stops.create({
				id: data.stop[i].id,
				connection: connections,
				view: data.stop[i].view,
				description: objectToArray(data.stop[i].description),
				propertySet: data.stop[i].propertySet ? objectToArray(data.stop[i].propertySet.property) : undefined,
				assetRef: objectToArray(data.stop[i].assetRef),
				title: objectToArray(data.stop[i].title)
			});
		}

		// create new instance of AssetCollection
		var assets = new TapAssetCollection(null, data.id);
		// load asset models
		var numAssets = data.asset.length;
		for (i = 0; i < numAssets; i++) {
			// modifiy source propertySet child to match similar elements
			if(data.asset[i].source && data.asset[i].source) {
				var propertySet = [];
				var numSources = data.asset[i].source.length;
				for (j = 0; j < numSources; j++) {
					if(data.asset[i].source[j].propertySet) {
						data.asset[i].source[j].propertySet = data.asset[i].source[j].propertySet.property;
					}
				}
			}
			assets.create({
				assetRights: objectToArray(data.asset[i].assetRights),
				content: objectToArray(data.asset[i].content),
				id: data.asset[i].id,
				source: objectToArray(data.asset[i].source),
				propertySet: data.asset[i].propertySet ? objectToArray(data.asset[i].propertySet.property) : undefined
			});
		}
		// clear out the temporary models
		stops.reset();
		assets.reset();
	};
}
