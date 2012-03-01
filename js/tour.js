(function($){
	// initialize jqm properties to allow backbone to handle routing
	$.mobile.hashListeningEnabled = false;
	$.mobile.linkBindingEnabled = false;
	$.mobile.pushStateEnabled = false;		

	$(document).ready(function() {
		// specify url to tourML document
		tap.url = 'TourMLTourSetInternal.xml';
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
		    render: function() {
				$(this.el).html(this.template({
				}));
				return this;
		    }
		});				

		// setup a tour stop view
		window.TourStopView = Backbone.View.extend({
		   el: $('#tour-stop').find(":jqmData(role='content')"),
		    template: _.template($('#tour-stop-tpl').html()),
		    render: function() {
				$(this.el).html(this.template({
					publishDate: tap.tours.get(tap.currentTour).get('publishDate')[0].value,
					tourStopId: tap.tourStops.length,
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
				'tourstop/:id/:stopid': 'tourStop'
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
				// setup detailed view of tour and render
				this.tourKeypadView = new TourKeypadView();
				this.tourKeypadView.render();
		    },
			tourStop: function(id, stopid) {
				// set the selected tour
				tap.tours.selectTour(id);
				// have jqm change pages
				$.mobile.changePage('#tour-stop', { transition: 'none', reverse: false, changeHash: false});
				// change the page title
				$('#tour-stop #page-title').html(tap.tours.get(tap.currentTour).get('title')[0].value);
				// setup detailed view of tour and render
				this.tourStopView = new TourStopView();
				this.tourStopView.render();
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


		// Keypad entry and delete
		var $write = $('#write'),
			shift = false,
			capslock = false;
		$('#keypad div div div keybtn').click(function(){
			var $this = $(this),
				character = $this.html();

			// Delete
			if ($this.hasClass('delete')) {
				var html = $write.html();

				$write.html(html.substr(0, html.length - 1));
				return false;
			}
			// Add the character
			$write.html($write.html() + character);
		});



	});		
}(jQuery));		
