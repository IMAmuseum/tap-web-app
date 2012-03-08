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
		    }
		});				
		
		// setup a tour keypad view
		window.TourKeypadView = Backbone.View.extend({
		    el: $('#tour-keypad').find(":jqmData(role='content')"),
		    template: _.template($('#tour-keypad-tpl').html()),
		    events: {
				'click #gobtn' : 'submit',
				'click keybtn' : 'writekeycode',
				'click .delete' : 'deletekeycode',
			    },
		    render: function() {
				$(this.el).html(this.template({
				}));
				return this;
		    },
		    submit: function() {
				$keycode = $('#write').html();
				$id = this.options;
				$destUrl = "#tourstop/"+$id+"/"+$keycode;
				Backbone.history.navigate($destUrl, true);
				return false;
		    },
		    writekeycode: function(e) {
				var $write = $('#write');
				var $btnvalue = $(e.currentTarget);
				$character = $btnvalue.html();
				// Add the character
				$write.html($write.html() + $character);
				return this;
			},
		    deletekeycode: function(e) {
				var $write = $('#write');
				$write.html("");
				return false;
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
					tourStopCode : $stop["attributes"]["propertySet"][0].value,
				}));
				return this;
		    }
		});				

		// setup a tour stop Image view
		window.TourStopImageView = Backbone.View.extend({
		    el: $('#tour-stop').find(":jqmData(role='content')"),
		    template: _.template($('#tour-stop-image-tpl').html()),
		    render: function() {
				$(this.el).html(this.template({
					tourStopTitle : $stop["attributes"]["title"][0].value,
					tourStopCode : $stop["attributes"]["propertySet"][0].value,
				}));
				return this;
		    }
		});				

		// setup a tour stop Video view
		window.TourStopVideoView = Backbone.View.extend({
		    el: $('#tour-stop').find(":jqmData(role='content')"),
		    template: _.template($('#tour-stop-video-tpl').html()),
		    render: function() {
				$(this.el).html(this.template({
					tourStopTitle : $stop["attributes"]["title"][0].value,
					tourStopCode : $stop["attributes"]["propertySet"][0].value,
				}));
				return this;
		    }
		});				

		// setup a tour stop Audio view
		window.TourStopAudioView = Backbone.View.extend({
		    el: $('#tour-stop').find(":jqmData(role='content')"),
		    template: _.template($('#tour-stop-audio-tpl').html()),
		    render: function() {
				$(this.el).html(this.template({
					tourStopTitle : $stop["attributes"]["title"][0].value,
					tourStopCode : $stop["attributes"]["propertySet"][0].value,
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
		    	list: function() {
				// have jqm change pages
				$.mobile.changePage('#tours', {transition: 'none', reverse: true, changeHash: false});
				// setup list view of all the tours and render
				this.tourListView = new TourListView({model: tap.tours});
				this.tourListView.render();

		    },
			tourDetails: function(id) {
				// set the selected tour
				tap.tours.selectTour(id);
				// have jqm change pages
				$.mobile.changePage('#tour-details', { transition: 'none', reverse: false, changeHash: false});
				// change the page title
				$('#tour-details #page-title').html(tap.tours.get(tap.currentTour).get('title')[0].value);
				// attach the tour id to the get started button 
				$('#tour-details #start-tour-id').attr("href", "#tourkeypad/"+id);
				// setup detailed view of tour and render
				this.tourDetailedView = new TourDetailedView();
				this.tourDetailedView.render();
		    },
			tourKeypad: function(id) {
				// set the selected tour
				tap.tours.selectTour(id);
				// have jqm change pages
				$.mobile.changePage('#tour-keypad', { transition: 'none', reverse: false, changeHash: false});
				// change the page title
				$('#tour-details #page-title').html(tap.tours.get(tap.currentTour).get('title')[0].value);
				// setup detailed view of keypad and render
				this.tourKeypadView = new TourKeypadView(id);
				this.tourKeypadView.render();
		    },
			tourStop: function(id, keycode) {
				// set the selected tour
				tap.tours.selectTour(id);
				// have jqm change pages
				$.mobile.changePage('#tour-stop', { transition: 'none', reverse: false, changeHash: false});
				// change the page title
				$('#tour-stop #page-title').html(tap.tours.get(tap.currentTour).get('title')[0].value);
				// setup detailed view of tour and render
				$stop = tap.tourStops.getStopByKeycode(keycode);
				switch($stop["attributes"]["view"]) {  // Set appropriate tour stop view type 
					case 'StopGroup':
						this.tourStopView = new TourStopView(keycode);
						return;
					case 'ImageStop':
						this.tourStopView = new TourStopImageView(keycode);
						this.tourStopView.render();
						return;
					case 'VideoStop':
						this.tourStopView = new TourStopVideoView(keycode);
						this.tourStopView.render();
						return;
					case 'AudioStop':
						this.tourStopView = new TourStopAudioView(keycode);
						this.tourStopView.render();
						return;
					default:
						this.tourStopView = new TourStopView(keycode);
						this.tourStopView.render();
						return;
				}
		    }
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
