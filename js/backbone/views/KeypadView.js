jQuery(function() {
	// setup a tour keypad view
	window.TourKeypadView = Backbone.View.extend({
		el: $('#tour-keypad').find(":jqmData(role='content')"),
		template: _.template($('#tour-keypad-tpl').html()),
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
			this.$el.html(this.template({}));
			return this;
		}
	});
});