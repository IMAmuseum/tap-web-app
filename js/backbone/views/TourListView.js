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
});
