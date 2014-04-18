/*
 * Backbone View for providing helper functions to all TAP Views
 * All STOP views in TAP should extend from this
 */
TapAPI.classes.views.BaseView = Backbone.View.extend({
	initialize: function(options) {
		this.title = '';
		this.displayHeader = true;
		this.displayFooter = true;
		this.displayBackButton = true;
		this.displayLoader = false;
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
	},
	getNextStopPath: function () {
		var nextStopId = this.getNextStopId();
		var fragments = Backbone.history.fragment.split("/");
		return !_.isUndefined(nextStopId) ? '#' + fragments[0] + '/' + TapAPI.currentTour + '/stop/' + nextStopId : undefined;
	},
	getNextStopId : function () {
		var nextStop = this.model.getSortedConnections();
		return !_.isUndefined(nextStop) ? nextStop[0].destId : undefined;
	},
	preRender : function () {
		if (this.displayLoader === true) {
		    Backbone.trigger('tap.displayLoader');
		}
	},
	postRender : function () {
		if (this.displayLoader === true) {
			Backbone.trigger('tap.removeLoader');
		}
	}
});