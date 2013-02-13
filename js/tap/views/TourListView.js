define([
    'jquery',
    'underscore',
    'backbone',
    'tap/views/BaseView',
    'tap/views/TourListItemView'
], function($, _, Backbone, BaseView, TourListItemView) {
	var tourListView = BaseView.extend({
		initialize: function() {
			this.options.page_title = 'Tour List';
			this.options.header_nav = false;
			this.options.footer_nav = false;
		},
		renderContent: function() {
			var content_template = TapAPI.templateManager.get('tour-list');

			this.$el.find(":jqmData(role='content')").append(content_template);

			var tourList = this.$el.find('#tour-list');
			// iterate through all of the tour models to setup new views
			_.each(this.model.models, function(tour) {
				tourList.append(new TourListItemView({model: tour}).render().el);
			}, this);
			$('#tour-list').listview('refresh'); // refresh listview since we generated the data dynamically
		}
	});
	return tourListView;
});