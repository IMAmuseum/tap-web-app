(function($){
	// initialize jqm properties to allow backbone to handle routing
	$.mobile.hashListeningEnabled = false;
	$.mobile.linkBindingEnabled = false;
	$.mobile.pushStateEnabled = false;		

	$(document).ready(function() {
		// specify url to tourML document
		tap.url = 'data/TourMLTourSetInternal.xml';
		// initialize app
		tap.initApp();

		Backbone.View.prototype.close = function () {
			if(document.getElementById('audioPlayer')) document.getElementById('audioPlayer').pause();
			if(document.getElementById('videoPlayer')) document.getElementById('videoPlayer').pause();
			this.undelegateEvents();
			$(this).empty;
			this.unbind();
		};

		// setup a simple view to handle listing all tours
		window.TourListView = Backbone.View.extend({
		    el: $('#tour-list'),
		    initialize: function() {
			$(this.el).empty();
			this.model.bind('reset', this.render);
		    },
		    render: function(event) {
			// iterate through all of the tour models to setup new views
			_.each(this.model.models, function(tour) {
					$(this.el).append(new TourListItemView({model: tour}).render().el);
			}, this);
			$(this.el).listview('refresh'); // refresh listview since we generated the data dynamically
		    }
		});

		// setup an individual view of a tour
		window.TourListItemView = Backbone.View.extend({
		    tagName: 'li',
		    template: _.template($('#tour-list-item-tpl').html()),
		    render: function() {
				$(this.el).html(this.template({
					title: this.model.get('title')[0].value,
					id: this.model.get('id')
				}));
				return this;
		    }
		});
		
		// setup a detailed view of a tour
		window.TourDetailedView = Backbone.View.extend({
		    el: $('#tour-details').find(":jqmData(role='content')"),
		    template: _.template($('#tour-details-tpl').html()),
		    render: function() {
				$(this.el).html(this.template({
					publishDate: tap.tours.get(tap.currentTour).get('publishDate')[0].value,
					description: tap.tours.get(tap.currentTour).get('description')[0].value,
					stopCount: tap.tourStops.length,
					assetCount: tap.tourAssets.length
				}));
				return this;
		    },
		});				
		
		// setup a tour keypad view
		window.TourKeypadView = Backbone.View.extend({
		    el: $('#tour-keypad').find(":jqmData(role='content')"),
		    template: _.template($('#tour-keypad-tpl').html()),
		    events: {
				'tap #gobtn' : 'submit',
				'tap #keypad div button' : 'writekeycode',
				'tap #delete' : 'clearkeycode',
			    },
		    submit: function() {
				// validate tour stop code
				if(!$('#write').html()) return;
				if(!tap.tourStops.getStopByKeycode($('#write').html())){
					$.mobile.changePage('#error_invalidCode', 'pop', true, true);
					$('#write').html("");
					return;
				}
				$destUrl = "#tourstop/"+this.options+"/"+$('#write').html();
				Backbone.history.navigate($destUrl, true);
		    },
		    writekeycode: function(e) {
				$('#write').html($('#write').html() + $(e.currentTarget).html());
			},
		    clearkeycode: function(e) {
				$('#write').html("");
			},
		    render: function() {
				$(this.el).html(this.template({
				}));
				return this;
		    },
		});				

		// setup a tour stop view
		window.TourStopView = Backbone.View.extend({
		    el: $('#tour-stop').find(":jqmData(role='content')"),
		    template: _.template($('#tour-stop-tpl').html()),
		    render: function() {
				$(this.el).html(this.template({
					tourStopTitle : $stop["attributes"]["title"][0].value,
					tourStopDescription : $stop["attributes"]["description"][0].value,
				}));
				return this;
		    }
		});				

		// setup a tour stop Image view
		window.TourStopImageView = Backbone.View.extend({
		    el: $('#tour-stop').find(":jqmData(role='content')"),
		    template: _.template($('#tour-stop-image-tpl').html()),
		    render: function() {
				if($stop["attributes"]["assetRef"]){
					$.each($stop["attributes"]["assetRef"], function() {
						$assetItem = tap.tourAssets.models;
						for(var i=0;i<$assetItem.length;i++) {
							if(($assetItem[i].get('id') == this['id']) && (this['usage']=="primary")){
								$imageUri = $assetItem[i].attributes.source[0].uri;
							}
							if(($assetItem[i].get('id') == this['id']) && (this['usage']=="icon")){
								$iconUri = $assetItem[i].attributes.source[0].uri;
							}
						}
					});
				}
				$(this.el).html(this.template({
					tourImageUri : $imageUri,
					tourIconUri : $iconUri,
					tourStopTitle : $stop["attributes"]["title"][0].value,
				}));
				var soloPhotoSwipe = $("#soloImage a").photoSwipe({ 
					enableMouseWheel: false, 
					enableKeyboard: true, 
					doubleTapZoomLevel : 0,
					captionAndToolbarOpacity : 0.8,
					minUserZoom : 0.0,
					preventSlideshow : true,
					jQueryMobile : true,
				});
				return this;
		    }
		});				

		// setup a tour stop Gallery view
		window.TourStopGalleryView = Backbone.View.extend({
		    el: $('#tour-stop').find(":jqmData(role='content')"),
		    template: _.template($('#tour-gallery-tpl').html()),
		    render: function() {
				$(this.el).html(this.template({
					tourStopTitle : $stop["attributes"]["title"][0].value,
				}));
				var myPhotoSwipe = $("#Gallery a").photoSwipe({ 
					enableMouseWheel: false, 
					enableKeyboard: true, 
					doubleTapZoomLevel : 0,
					captionAndToolbarOpacity : 0.8,
					minUserZoom : 0.0,
					jQueryMobile : true,
				});
				return this;
		    }
		});				

		// setup a tour stop Video view
		window.TourStopVideoView = Backbone.View.extend({
		    el: $('#tour-stop').find(":jqmData(role='content')"),
		    template: _.template($('#tour-stop-video-tpl').html()),
		    render: function() {
				if($stop["attributes"]["assetRef"]){
					$.each($stop["attributes"]["assetRef"], function() {
						$assetItem = tap.tourAssets.models;
						for(var i=0;i<$assetItem.length;i++) {
							if($assetItem[i].get('id') == this['id']){
								for(var j=0;j<$assetItem[i].attributes.source.length;j++){
									if($assetItem[i].attributes.source[j].format == "video/mp4"){
										$mp4VideoUri = $assetItem[i].attributes.source[j].uri;
									}
									if($assetItem[i].attributes.source[j].format == "video/ogg"){
										$oggVideoUri = $assetItem[i].attributes.source[j].uri;
									}
								}
							}
						}
					});
				}
				$(this.el).html(this.template({
					tourStopTitle : $stop["attributes"]["title"][0].value,
					tourStopMp4Video : $mp4VideoUri,
					tourStopOggVideo : $oggVideoUri,
				}));
				return this;
		    }
		});				

		// setup a tour stop Audio view
		window.TourStopAudioView = Backbone.View.extend({
		    el: $('#tour-stop').find(":jqmData(role='content')"),
		    template: _.template($('#tour-stop-audio-tpl').html()),
		    render: function() {
				if($stop["attributes"]["assetRef"]){
					$.each($stop["attributes"]["assetRef"], function() {
						$assetItem = tap.tourAssets.models;
						for(var i=0;i<$assetItem.length;i++) {
							if($assetItem[i].get('id') == this['id']){
								for(var j=0;j<$assetItem[i].attributes.source.length;j++){
									if($assetItem[i].attributes.source[j].format == "audio/mp3"){
										$mp3AudioUri = $assetItem[i].attributes.source[j].uri;
									}
									if($assetItem[i].attributes.source[j].format == "audio/ogg"){
										$oggAudioUri = $assetItem[i].attributes.source[j].uri;
									}
									if($assetItem[i].attributes.source[j].format == "audio/wav"){
										$wavAudioUri = $assetItem[i].attributes.source[j].uri;
									}
								}
							}
						}
					});
				}
				$(this.el).html(this.template({
					tourStopMp3Audio : $mp3AudioUri,
					tourStopOggAudio : $oggAudioUri,
					tourStopWavAudio : $wavAudioUri,
					tourStopTitle : $stop["attributes"]["title"][0].value,
				}));
				return this;
		    }
		});				


		// setup a tour stop Web view
		window.TourStopWebView = Backbone.View.extend({
		    el: $('#tour-stop').find(":jqmData(role='content')"),
		    template: _.template($('#tour-stop-web-tpl').html()),
		    render: function() {
				$(this.el).html(this.template({
					tourStopTitle : $stop["attributes"]["title"][0].value,
				}));
				return this;
		    }
		});				

		// setup a tour stop Object view
		window.TourStopObjectView = Backbone.View.extend({
		    el: $('#tour-stop').find(":jqmData(role='content')"),
		    template: _.template($('#tour-stop-object-tpl').html()),
		    render: function() {
				$(this.el).html(this.template({
					tourStopTitle : $stop["attributes"]["title"][0].value,
				}));
				return this;
		    }
		});				

		// setup a tour stop Geo view
		window.TourStopGeoView = Backbone.View.extend({
		    el: $('#tour-stop').find(":jqmData(role='content')"),
		    template: _.template($('#tour-stop-geo-tpl').html()),
		    render: function() {
				$(this.el).html(this.template({
					tourStopTitle : $stop["attributes"]["title"][0].value,
				}));
				return this;
		    }
		});				

		// declare router
		var AppRouter = Backbone.Router.extend({
			// define routes
			routes: {
				'': 'list',
				'tour/:id': 'tourDetails',
				'tourkeypad/:id': 'tourKeypad',
				'tourstop/:id/:keycode': 'tourStop'
			},
			bookmarkMode:false,
			showView: function(selector, view) {
			    if (tap.currentView){
				tap.currentView.close();
			    }
			    $(selector).html(view.render().el);
			    tap.currentView = view;
			    return view;
			},
		    	list: function() {
				// have jqm change pages
				$.mobile.changePage('#tours', {transition: 'fade', reverse: true, changeHash: false});
				// setup list view of all the tours and render
				this.tourListView = new TourListView({model: tap.tours});
				tap.currentView = this.tourListView;
				this.tourListView.render();

			},
			tourDetails: function(id) {
				// set the selected tour
				tap.tours.selectTour(id);
				// have jqm change pages
				$.mobile.changePage('#tour-details', { transition: 'fade', reverse: false, changeHash: false});
				// change the page title
				$('#tour-details #page-title').html(tap.tours.get(tap.currentTour).get('title')[0].value);
				// attach the tour id to the get started button 
				$('#tour-details #start-tour-id').attr("href", "#tourkeypad/"+id);
				// setup detailed view of tour and render
				this.tourDetailedView = new TourDetailedView();
            			app.showView('#content', this.tourDetailedView);
			},
			tourKeypad: function(id) {
				// set the selected tour
				tap.tours.selectTour(id);
				// have jqm change pages
				$.mobile.changePage('#tour-keypad', { transition: 'fade', reverse: false, changeHash: false});
				// change the page title
				$('#tour-details #page-title').html(tap.tours.get(tap.currentTour).get('title')[0].value);
				// setup detailed view of keypad and render
				this.tourKeypadView = new TourKeypadView(id);
            			app.showView('#content', this.tourKeypadView);
		    	},
			tourStop: function(id, keycode) {
				// set the selected tour
				tap.tours.selectTour(id);
				// have jqm change pages
				$.mobile.changePage('#tour-stop', { transition: 'fade', reverse: false, changeHash: false});
				// change the page title
				$('#tour-stop #page-title').html(tap.tours.get(tap.currentTour).get('title')[0].value);
				// setup detailed view of tour and render
				$stop = tap.tourStops.getStopByKeycode(keycode);
				switch($stop["attributes"]["view"]) {  // Set appropriate tour stop view type 
					case 'StopGroup':
						this.tourStopView = new TourStopView();
            					app.showView('#content', this.tourStopView);
						return;
					case 'ImageStop':
						this.tourStopImageView = new TourStopImageView();
            					app.showView('#content', this.tourStopImageView);
						return;
					case 'GalleryStop':
						this.tourStopGalleryView = new TourStopGalleryView();
            					app.showView('#content', this.tourStopGalleryView);
						return;
					case 'VideoStop':
						this.tourStopVideoView = new TourStopVideoView();
            					app.showView('#content', this.tourStopVideoView);
						return;
					case 'AudioStop':
						this.tourStopAudioView = new TourStopAudioView();
            					app.showView('#content', this.tourStopAudioView);
						return;
					case 'WebStop':
						this.tourStopWebView = new TourStopWebView();
            					app.showView('#content', this.tourStopWebView);
						return;
					case 'ObjectStop':
						this.tourStopObjectView = new TourStopObjectView();
            					app.showView('#content', this.tourStopObjectView);
						return;
					case 'GeoStop':
						this.tourStopGeoView = new TourStopGeoView();
            					app.showView('#content', this.tourStopGeoView);
						return;
					default:
						this.tourStopView = new TourStopView();
            					app.showView('#content', this.tourStopView);
						return;
				}
		    	},
		});
		// initialize router
		var app = new AppRouter();
		// start backbone history collection
		Backbone.history.start();
		
		// override click event for back button
		$('body').find(":jqmData(rel='back')").click(function(e) {
			e.preventDefault();
			window.history.back();
		});


	});		
}(jQuery));		
