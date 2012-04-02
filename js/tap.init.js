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
		tap.tours = new TapTourCollection;		
		//localStorage.clear();
		//if(tap.tours.localStorage){
		//	$(this).remove;	
			//alert("there is ttls");
		//} 
		//console.dir(tap.tours.localStorage);
		// retrieve tours from local storage
		tap.tours.fetch();
		//console.dir(tap.tours.localStorage);
		// populate local storage if this is a first run
		if(!tap.tours.length) {
			// load tourML
			var tourML = xmlToJson(loadXMLDoc(tap.url));
			if(tourML.tour) { // Single tour
				tap.initModels(tourML.tour);
			} else if(tourML.tourSet && tourML.tourSet.tourRef) { // TourSet w/ external tours
				for(var i = 0; i < tourML.tourSet.tourRef.length; i++) {
					var data = xmlToJson(loadXMLDoc(tourML.tourSet.tourRef[i].uri));
					tap.initModels(data.tour);
				}
			} else if(tourML.tourSet && tourML.tourSet.tour) { // TourSet w/ tours as children elements
				for(var i = 0; i < tourML.tourSet.tour.length; i++) {
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
			appResource: data.tourMetadata && data.tourMetadata.appResource ? objectToArray(data.tourMetadata.appResource) : undefined,
			connection: objectToArray(data.connection),
			description: data.tourMetadata && data.tourMetadata.description ? objectToArray(data.tourMetadata.description) : undefined,
			lastModified: data.tourMetadata && data.tourMetadata.lastModified ? data.tourMetadata.lastModified : undefined,
			propertySet: data.tourMetadata && data.tourMetadata.propertySet ? objectToArray(data.tourMetadata.property) : undefined,
			publishDate: data.tourMetadata && data.tourMetadata.publishDate ? objectToArray(data.tourMetadata.publishDate) : undefined,
			rootStopRef: data.tourMetadata && data.tourMetadata.rootStopRef ? objectToArray(data.tourMetadata.rootStopRef) : undefined,
			title: data.tourMetadata && data.tourMetadata.title ? objectToArray(data.tourMetadata.title) : undefined
		});

		// create new instance of StopCollection
		var stops = new TapStopCollection(null, data.id);
		// load tour models
		for (var i = 0; i < data.stop.length; i++) {
			var connections = [];
			for(var j = 0; j < data.connection.length; j++) {
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
		for (var i = 0; i < data.asset.length; i++) {
			// modifiy source propertySet child to match similar elements
			if(data.asset[i].source && data.asset[i].source) {
				var propertySet = [];
				for (var j = 0; j < data.asset[i].source.length; j++) {
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
