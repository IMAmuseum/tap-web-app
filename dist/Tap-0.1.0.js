/*
 * TAP - v0.1.0 - 2012-05-31
 * http://tapintomuseums.org/
 * Copyright (c) 2011-2012 Indianapolis Museum of Art
 * GPLv3
 */

String.prototype.replaceArray = function(find, replace) {
	var replaceString = this;
	for (var i = 0; i < find.length; i++) {
		replaceString = replaceString.replace(find[i], replace);
	}
	return replaceString;
};

String.prototype.toCamel = function(){
    return this.replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
		.replace(/\s/g, '')
		.replace(/^(.)/, function($1) { return $1.toLowerCase(); });
};

/*
 * Retrieve attribute based on language
 */
function getAttributeByLanguage(attr) {
	var items = [];
	for(var i = 0; i < attr.length; i++) {
		// get language specific and language neutral
		if(!attr[i].lang || (attr[i].lang && attr[i].lang == tap.language)) {
			items.push(attr[i]);
		}
	}
	// return all items if no language matched
	if(items.length === 0) {
		items = attr;
	}
	return items;
}

/*
 * Load xml document
 */
function loadXMLDoc(url) {
	xhttp = new XMLHttpRequest();
	xhttp.open('GET', url, false);
	xhttp.send();
	return xhttp.responseXML;
}

/*
 * Attempt to make the variable an array
 */
function objectToArray(obj) {
	if(obj === undefined) return;
	return Object.prototype.toString.call(obj) !== '[object Array]' ? [obj] : obj;
}

/*
 * Convert xml to JSON
 */
function xmlToJson(xml, namespace) {
	var obj = true,
		i = 0;
	// retrieve namespaces
	if(!namespace) {
		namespace = ['xml:'];
		for(i = 0; i < xml.documentElement.attributes.length; i++) {
			if(xml.documentElement.attributes.item(i).nodeName.indexOf('xmlns') != -1) {
				namespace.push(xml.documentElement.attributes.item(i).nodeName.replace('xmlns:', '') + ':');
			}
		}
	}

	var result = true;
	if (xml.attributes && xml.attributes.length > 0) {
		var attribute;
		result = {};
		for (var attributeID = 0; attributeID < xml.attributes.length; attributeID++) {
			attribute = xml.attributes.item(attributeID);
			result[attribute.nodeName.replaceArray(namespace, '').toCamel()] = attribute.nodeValue;
		}
	}
	if (xml.hasChildNodes()) {
		var key, value, xmlChild;
		if (result === true) { result = {}; }
		for (var child = 0; child < xml.childNodes.length; child++) {
			xmlChild = xml.childNodes.item(child);
			if ((xmlChild.nodeType & 7) === 1) {
				key = xmlChild.nodeName.replaceArray(namespace, '').toCamel();
				value = xmlToJson(xmlChild, namespace);
				if (result.hasOwnProperty(key)) {
					if (result[key].constructor !== Array) { result[key] = [result[key]]; }
					result[key].push(value);
				} else { result[key] = value; }
			} else if ((xmlChild.nodeType - 1 | 1) === 3) {
				key = 'value';
				value = xmlChild.nodeType === 3 ? xmlChild.nodeValue.replace(/^\s+|\s+$/g, '') : xmlChild.nodeValue;
				if (result.hasOwnProperty(key)) { result[key] += value; }
				else if (xmlChild.nodeType === 4 || value !== '') { result[key] = value; }
			}
		}
	}
	return(result);
}
// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.models === 'undefined'){TapAPI.models = {};}
// TapAPI Namespace Initialization //

// define asset model
TapAPI.models.Asset = Backbone.Model.extend({
	get: function(attr) { // override get method
		if(!this.attributes[attr]) return this.attributes[attr];
		switch(attr) { // retrieve attribute based on language
			case 'tourMetadata':
			case 'propertySet':
			case 'source':
			case 'content':
				return getAttributeByLanguage(objectToArray(this.attributes[attr]));
			default:
				return this.attributes[attr];
		}
	}
});

// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.models === 'undefined'){TapAPI.models = {};}
// TapAPI Namespace Initialization //

// define stop model
TapAPI.models.Stop = Backbone.Model.extend({
	get: function(attr) { // override get method
		if(!this.attributes[attr]) return this.attributes[attr];
		switch(attr) {  // retrieve attribute based on language
			case 'tourMetadata':
			case 'propertySet':
			case 'description':
			case 'title':
				return getAttributeByLanguage(this.attributes[attr]);
			default:
				return this.attributes[attr];
		}
	}
});

// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.models === 'undefined'){TapAPI.models = {};}
// TapAPI Namespace Initialization //

// define tour model
TapAPI.models.Tour = Backbone.Model.extend({
	get: function(attr) { // override get method
		if(!this.attributes[attr]) return this.attributes[attr];
		switch(attr) {  // retrieve attribute based on language
			case 'tourMetadata':
			case 'propertySet':
			case 'description':
			case 'title':
				return getAttributeByLanguage(this.attributes[attr]);
			default:
				return this.attributes[attr];
		}
	}
});

// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.collections === 'undefined'){TapAPI.collections = {};}
// TapAPI Namespace Initialization //

// define assett collection
TapAPI.collections.Assets = Backbone.Collection.extend({
	model: TapAPI.models.Asset,
	initialize: function(models, id) {
		this.localStorage = new Backbone.LocalStorage(id + '-asset');
	}
});

// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.collections === 'undefined'){TapAPI.collections = {};}
// TapAPI Namespace Initialization //

// define stop collection
TapAPI.collections.Stops = Backbone.Collection.extend({
	model: TapAPI.models.Stop,
	initialize: function(models, id) {
		this.localStorage = new Backbone.LocalStorage(id + '-stop');
	},
	// retrieve the stop id of a given key code
	getStopByKeycode: function(key) {
		for(var i = 0; i < this.models.length; i++) {
			if(this.models[i].get('propertySet')) {
				for(var j = 0; j < this.models[i].get('propertySet').length; j++) {
					if(this.models[i].get('propertySet')[j].name == 'code' &&
						this.models[i].get('propertySet')[j].value == key) return this.models[i];
				}
			}
		}
		return false;
	}
});

// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.collections === 'undefined'){TapAPI.collections = {};}
// TapAPI Namespace Initialization //

// define tour collection
TapAPI.collections.Tours = Backbone.Collection.extend({
	model: TapAPI.models.Tour,
	localStorage: new Backbone.LocalStorage('tours'),
	selectTour: function(id) { // load data for the selected tour
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
		tap.tourStops.fetch();
		tap.tourAssets.fetch();
	}
});

Backbone.View.prototype.close = function () {
	if(document.getElementById('audioPlayer')) document.getElementById('audioPlayer').pause();
	if(document.getElementById('videoPlayer')) document.getElementById('videoPlayer').pause();
	
	this.$el.empty().undelegate();
	this.unbind();
	this.undelegateEvents();
	if (this.onClose){
		this.onClose();
	}
};
// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //

// Add this view to the registry
TapAPI.views.registry['tour_audio_stop'] = 'AudioStop';

// TODO: remove this deprecated mapping
TapAPI.views.registry['AudioStop'] = 'AudioStop';

jQuery(function() {

	// Define the AudioStop View
	TapAPI.views.AudioStop = Backbone.View.extend({

		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: TapAPI.templateManager.get('audio-stop'),

		render: function() {

			var mp3AudioUri, oggAudioUri, wavAudioUri;
			var asset_refs = tap.currentStop.get("assetRef");

			if (asset_refs) {
				_.each(asset_refs, function(assetRef) {
					var asset = tap.tourAssets.get(assetRef.id);
					var assetSources = asset.get("source");

					_.each(assetSources, function(assetSource){
						switch (assetSource.format) {
							case 'audio/mp3':
							case 'audio/mpeg':
								mp3AudioUri = assetSource.uri;
								break;
							case 'audio/ogg':
								oggAudioUri = assetSource.uri;
								break;
							case 'audio/wav':
								wavAudioUri = assetSource.uri;
								break;
						}
					});
				});
			}

			this.$el.html(this.template({
				tourStopMp3Audio : mp3AudioUri,
				tourStopOggAudio : oggAudioUri,
				tourStopWavAudio : wavAudioUri,
				tourStopTitle : tap.currentStop.get("title")[0].value
			}));
			return this;
		}
	});
});

// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //

jQuery(function() {
	// setup a tour stop view
	TapAPI.views.Stop = Backbone.View.extend({
		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: TapAPI.templateManager.get('stop'),
		render: function() {
			this.$el.html(this.template({
				tourStopTitle : tap.currentStop.get("title") ? tap.currentStop.get("title")[0].value : undefined,
				tourStopDescription : tap.currentStop.get('description') ? tap.currentStop.get('description')[0].value : undefined
			}));
			return this;
		}
	});
});

jQuery(function() {
	// setup a tour stop Gallery view
	window.TourStopGalleryView = Backbone.View.extend({
		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: _.template($('#tour-gallery-tpl').html()),
		render: function() {
			this.$el.html(this.template({
				tourStopTitle : tap.currentStop.get("title")[0].value
			}));
			var myPhotoSwipe = $("#Gallery a").photoSwipe({
				enableMouseWheel: false,
				enableKeyboard: true,
				doubleTapZoomLevel : 0,
				captionAndToolbarOpacity : 0.8,
				minUserZoom : 0.0,
				jQueryMobile : true
			});
			return this;
		}
	});
});

jQuery(function() {
	// setup a tour stop Geo view
	window.TourStopGeoView = Backbone.View.extend({
		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: _.template($('#tour-stop-geo-tpl').html()),
		render: function() {
			$(this.el).html(this.template({
				tourStopTitle : tap.currentStop.get("title")[0].value
			}));
			return this;
		}
	});
});

// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //

// Add this view to the registry
TapAPI.views.registry['tour_image_stop'] = 'ImageStop';

// TODO: remove this deprecated mapping
TapAPI.views.registry['ImageStop'] = 'ImageStop';

jQuery(function() {

	// Define the ImageStop View
	TapAPI.views.ImageStop = Backbone.View.extend({

		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: TapAPI.templateManager.get('image-stop'),

		render: function() {

			var imageUri, iconUri;
			var asset_refs = tap.currentStop.get("assetRef");

			if (asset_refs) {
				$.each(asset_refs, function() {
					$assetItem = tap.tourAssets.models;
					for(var i=0;i<$assetItem.length;i++) {
						if(($assetItem[i].get('id') == this['id']) && (this['usage'] == "primary" || this['usage'] == "tour_image")){
							imageUri = $assetItem[i].get('source')[0].uri;
						}
						if(($assetItem[i].get('id') == this['id']) && (this['usage']=="icon")){
							iconUri = $assetItem[i].get('source')[0].uri;
						}
					}
				});
			}

			this.$el.html(this.template({
				tourImageUri : imageUri,
				tourIconUri : iconUri,
				tourStopTitle : tap.currentStop.get("title")[0].value
			}));

			var soloPhotoSwipe = $("#soloImage a").photoSwipe({
				enableMouseWheel: false,
				enableKeyboard: true,
				doubleTapZoomLevel : 0,
				captionAndToolbarOpacity : 0.8,
				minUserZoom : 0.0,
				preventSlideshow : true,
				jQueryMobile : true
			});
			
			return this;
		}
	});
});
// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //

jQuery(function() {

	// Define the Keypad View
	TapAPI.views.Keypad = Backbone.View.extend({

		el: $('#tour-keypad').find(":jqmData(role='content')"),
		template: TapAPI.templateManager.get('keypad'),
		events: {
			'tap #gobtn' : 'submit',
			'tap #keypad div button' : 'writekeycode',
			'tap #delete' : 'clearkeycode'
		},

		submit: function() {
			// validate tour stop code
			if(!$('#write').html()) return;
			if(!tap.tourStops.getStopByKeycode($('#write').html())){
				$.mobile.changePage('#error_invalidCode', 'pop', true, true);
				$('#write').html("");
				return;
			}
			$destUrl = "#tourstop/"+tap.currentTour+"/"+$('#write').html();
			Backbone.history.navigate($destUrl, true);
		},
		writekeycode: function(e) {
			$('#write').html($('#write').html() + $(e.currentTarget).html());
		},
		clearkeycode: function(e) {
			$('#write').html("");
		},
		render: function() {
			this.$el.html(this.template());
			return this;
		},
		close: function() {
			// Override base close function so that events are not unbound
		}
	});
});
jQuery(function() {
	// setup a tour stop Object view
	window.TourStopObjectView = Backbone.View.extend({
		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: _.template($('#tour-stop-object-tpl').html()),
		render: function() {
			$(this.el).html(this.template({
				tourStopTitle : tap.currentStop.get("title")[0].value
			}));
			return this;
		}
	});
});

// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //

// Add this view to the registry
TapAPI.views.registry['tour_stop_group'] = 'StopGroup';

// TODO: remove this deprecated mapping
TapAPI.views.registry['StopGroup'] = 'StopGroup';

jQuery(function() {
	// setup a tour stop Audio view
	TapAPI.views.StopGroup = Backbone.View.extend({
		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: TapAPI.templateManager.get('stop-group'),
		render: function() {
			this.$el.html(this.template({
				tourStopTitle : getAttributeByLanguage(tap.currentStop.get("title"))[0].value,
				description : getAttributeByLanguage(tap.currentStop.get("description"))[0].value
			}));

			var connections = tap.currentStop.get('connection');
			var listContainer = this.$el.find("#stop-list");
			_.each(connections, function(connection) {
				var stop = tap.tourStops.get(connection.destId);
				if (stop) {
					var stopView = new TapAPI.views.StopGroupListItem({
						model: stop
					});

					listContainer.append(stopView.render().$el);
				}
			});
			
			listContainer.listview();

			return this;
		}
	});

	// setup an individual view of a tour
	TapAPI.views.StopGroupListItem = Backbone.View.extend({
		tagName: 'li',
		template: TapAPI.templateManager.get('stop-group-list-item'),
		render: function() {
			this.$el.html(this.template({
				title: this.model.get('title') ? this.model.get('title')[0].value : undefined,
				id: this.model.get('id'),
				tourId: tap.currentTour
			}));
			return this;
		}
	});
});

// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //

jQuery(function() {

	// Define the TourDetails View
	TapAPI.views.TourDetails = Backbone.View.extend({
		el: $('#tour-details').find(":jqmData(role='content')"),
		template: TapAPI.templateManager.get('tour-details'),
		render: function() {
			var currentTour = tap.tours.get(tap.currentTour);

			$(this.el).html(this.template({
				publishDate: currentTour.get('publishDate') ? currentTour.get('publishDate')[0].value : undefined,
				description: currentTour.get('description') ? currentTour.get('description')[0].value : undefined,
				stopCount: tap.tourStops.length,
				assetCount: tap.tourAssets.length
			}));
			return this;
		}
	});
});

jQuery(function() {
	// setup a simple view to handle listing all tours
	window.TourListView = Backbone.View.extend({
		el: $('#tour-list'),
		initialize: function() {
			this.$el.empty();
			this.model.bind('reset', this.render);
		},
		render: function(event) {
			// iterate through all of the tour models to setup new views
			_.each(this.model.models, function(tour) {
					$(this.el).append(new TourListItemView({model: tour}).render().el);
			}, this);
			this.$el.listview('refresh'); // refresh listview since we generated the data dynamically
		}
	});

	// setup an individual view of a tour
	window.TourListItemView = Backbone.View.extend({
		tagName: 'li',
		template: TapAPI.templateManager.get('tour-list-item'),
		render: function() {
			$(this.el).html(this.template({
				title: this.model.get('title') ? this.model.get('title')[0].value : undefined,
				id: this.model.get('id')
			}));
			return this;
		}
	});
});

// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //

// Add this view to the registry
TapAPI.views.registry['tour_video_stop'] = 'VideoStop';

// TODO: remove this deprecated mapping
TapAPI.views.registry['VideoStop'] = 'VideoStop';

jQuery(function() {

	// Define the VideoStop View
	TapAPI.views.VideoStop = Backbone.View.extend({

		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: TapAPI.templateManager.get('video-stop'),

		render: function() {

			var mp4ViedoUri, oggVideoUri;
			var asset_refs = tap.currentStop.get("assetRef");

			if (asset_refs) {
				_.each(asset_refs, function(assetRef) {
					var asset = tap.tourAssets.get(assetRef.id);
					var assetSources = asset.get("source");

					_.each(assetSources, function(assetSource){
						switch (assetSource.format) {
							case 'video/mp4':
								mp4VideoUri = assetSource.uri;
								break;
							case 'video/ogg':
								oggVideoUri = assetSource.uri;
								break;
						}
					});
				});
			}

			this.$el.html(this.template({
				tourStopTitle : tap.currentStop.get("title")[0].value,
				tourStopMp4Video : mp4VideoUri,
				tourStopOggVideo : oggVideoUri
			}));

			return this;
		}
	});
});

jQuery(function() {
	// setup a tour stop Web view
	window.TourStopWebView = Backbone.View.extend({
		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: _.template($('#tour-stop-web-tpl').html()),
		render: function() {
			$(this.el).html(this.template({
				tourStopTitle : tap.currentStop.get("title")[0].value
			}));
			return this;
		}
	});
});

jQuery(function() {
	AppRouter = Backbone.Router.extend({
		// define routes
		views: {},
		routes: {
			'': 'list',
			'tour/:id': 'tourDetails',
			'tourkeypad/:id': 'tourKeypad',
			'tourstop/:id/:keycode': 'tourStop'
		},
		bookmarkMode:false,

		/**
		 * Show the view of the given class
		 * @param selector   Selector for the element to render within
		 * @param view_class The class of the view to render
		 * @note The view will attempt to render the current stop
		 */
		showView: function(selector, view_class) {

			// Close the current view
			// TODO: Check if the class is the same?
			if (tap.currentView){
				tap.currentView.close();
			}

			// See if we have one of these views instantiated already
			if (this.views[view_class] == undefined) {
				this.views[view_class] = new TapAPI.views[view_class]();
			}

			// Render the view into the given element
			$(selector).html(this.views[view_class].render().el);
			tap.currentView = this.views[view_class];
			return tap.currentView;
		},

		list: function() {
			// have jqm change pages
			$.mobile.changePage('#tours', {transition: 'fade', reverse: true, changeHash: false});
			// setup list view of all the tours and render
			this.tourListView = new TourListView({model: tap.tours});
			tap.currentView = this.tourListView;
			this.tourListView.render();
		},

		/**
		 * Route to the tour details 
		 * @param id The id of the tour
		 */
		tourDetails: function(id) {
			// set the selected tour
			tap.tours.selectTour(id);
			// have jqm change pages
			$.mobile.changePage('#tour-details', { transition: 'fade', reverse: false, changeHash: false});
			// change the page title
			$('#tour-details #page-title').html(tap.tours.get(tap.currentTour).get('title')[0].value);
			// attach the tour id to the get started button
			$('#tour-details #start-tour-id').attr("href", "#tourkeypad/"+id);
			this.showView('#content', 'TourDetails');
		},

		/**
		 * Route to the keypad
		 * @param id The id of the tour
		 */
		tourKeypad: function(id) {
			// set the selected tour
			tap.tours.selectTour(id);
			// have jqm change pages
			$.mobile.changePage('#tour-keypad', { transition: 'fade', reverse: false, changeHash: false});
			// change the page title
			$('#tour-details #page-title').html(tap.tours.get(tap.currentTour).get('title')[0].value);
			this.showView('#content', 'Keypad');
		},

		/**
		 * Route to the stop with the given code
		 * @param id      The tour ID
		 * @param keycode The code for the stop
		 */
		tourStop: function(id, keycode) {

			// set the selected tour
			tap.tours.selectTour(id);
			// have jqm change pages
			$.mobile.changePage('#tour-stop', { transition: 'fade', reverse: false, changeHash: false});
			// change the page title
			$('#tour-stop #page-title').html(tap.tours.get(tap.currentTour).get('title')[0].value);
			// setup detailed view of tour and render
			tap.currentStop = tap.tourStops.getStopByKeycode(keycode);

			// Look up the class to instantiate in the views registry
			var api_class = TapAPI.views.registry[tap.currentStop.get('view')];
			if (api_class != undefined) {
				this.showView('#content', api_class);
			} else {
				console.log('View not in registry: ', tap.currentStop.get('view'));
				this.showView('#content', 'Stop');
			}

		}

	});
});

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
	 * @param url The url to the TourML document
	 */
	tap.initApp = function(url) {

		tap.url = url;

		// trigger tap init start event
		tap.trigger('tap.init.start');

		// create new instance of tour collection
		tap.tours = new TapAPI.collections.Tours();

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

		// initialize router
		tap.router = new AppRouter();		
		
	};
    
	/*
	 * Initialize models with data
	 */
	tap.initModels = function(data) {
		// create new tour
		tap.tours.create({
			id: data.id,
			appResource: data.tourMetadata && data.tourMetadata.appResource ? objectToArray(data.tourMetadata.appResource) : undefined,
			//appResource: objectToArray(data.appResource),
			connection: objectToArray(data.connection),
			description: data.tourMetadata && data.tourMetadata.description ? objectToArray(data.tourMetadata.description) : undefined,
			lastModified: data.tourMetadata && data.tourMetadata.lastModified ? data.tourMetadata.lastModified : undefined,
			propertySet: data.tourMetadata && data.tourMetadata.propertySet ? objectToArray(data.tourMetadata.property) : undefined,
			publishDate: data.tourMetadata && data.tourMetadata.publishDate ? objectToArray(data.tourMetadata.publishDate) : undefined,
			rootStopRef: data.tourMetadata && data.tourMetadata.rootStopRef ? data.tourMetadata.rootStopRef : undefined,
			title: data.tourMetadata && data.tourMetadata.title ? objectToArray(data.tourMetadata.title) : undefined
			// description: objectToArray(data.description),
			// lastModified: data.lastModified,
			// propertySet: objectToArray(data.propertySet.property),
			// publishDate: objectToArray(data.publishDate),
			// rootStopRef: objectToArray(data.rootStopRef),
			// title: objectToArray(data.title)
		});

		var i, j;
		// create new instance of StopCollection
		var stops = new TapAPI.collections.Stops(null, data.id);
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
		var assets = new TapAPI.collections.Assets(null, data.id);
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

// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.templates === 'undefined'){TapAPI.templates = {};}
// TapAPI Namespace Initialization //

TapAPI.templateManager = {

        get : function(templateName) {
                if (TapAPI.templates[templateName] === undefined) {
                        $.ajax({
                                async : false,
                                dataType : 'html',
                                url : 'js/backbone/templates/' + templateName + '.tpl.html',
                                success : function(data, textStatus, jqXHR) {
                                        TapAPI.templates[templateName] = _.template(data);
                                }
                        });
                }

                return TapAPI.templates[templateName];
        }

};
// TapAPI Namespace Initialization //
if (typeof TapAPI === "undefined"){TapAPI = {};}
if (typeof TapAPI.templates === "undefined"){TapAPI.templates = {};}
// TapAPI Namespace Initialization //
TapAPI.templates['audio-stop'] = undefined
TapAPI.templates['image-stop'] = undefined
TapAPI.templates['keypad'] = undefined
TapAPI.templates['stop-group-list-item'] = undefined
TapAPI.templates['stop-group'] = undefined
TapAPI.templates['stop'] = undefined
TapAPI.templates['tour-details'] = undefined
TapAPI.templates['tour-list-item'] = undefined
TapAPI.templates['video-stop'] = undefined