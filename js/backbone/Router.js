jQuery(function() {
	AppRouter = Backbone.Router.extend({
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
		}
	});
});
