define([
    'jquery',
    'underscore',
    'backbone',
    'tap/views/AppView'
], function($, _, Backbone, App) {
	var baseView = Backbone.View.extend({
		close: function() {
			this.removeAllChildViews();
			this.remove();
			this.unbind();
			this.undelegateEvents();
			if (this.onClose){
				this.onClose();
			}
		},
		removeAllChildViews : function() {
			if (this.childViews) {
				_.each(this.childViews, function(view) {
					this.childViews[i].close();
				});
			}

			return this;
		}
	});
	return baseView;
});