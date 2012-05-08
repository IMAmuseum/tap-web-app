Backbone.View.prototype.close = function () {
	if(document.getElementById('audioPlayer')) document.getElementById('audioPlayer').pause();
	if(document.getElementById('videoPlayer')) document.getElementById('videoPlayer').pause();
	
	this.$el.empty().undelegate();
	this.unbind();
	this.undelegateEvents();
	if (this.onClose){
		this.onClose();
	}
};