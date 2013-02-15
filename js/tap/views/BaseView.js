define([
    'jquery',
    'underscore',
    'backbone',
    'tap/TapAPI',
    'backbone-super'
], function($, _, Backbone, TapAPI) {
	var baseView = Backbone.View.extend({
		initialize: function() {
			this.title = '';
			this.displayHeader = true;
			this.displayFooter = true;
		},
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