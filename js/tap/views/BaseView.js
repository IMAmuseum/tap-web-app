/*
 * Backbone View for providing helper functions to all TAP Views
 * All STOP views in TAP should extend from this
 */
TapAPI.classes.views.BaseView = Backbone.View.extend({
	initialize: function() {
		this.title = '';
		this.displayHeader = true;
		this.displayFooter = true;
		this.displayBackButton = true;
	},
	render: function() {},
	finishedAddingContent: function() {},
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