		Backbone.View.prototype.close = function () {
			if(document.getElementById('audioPlayer')) document.getElementById('audioPlayer').pause();
			if(document.getElementById('videoPlayer')) document.getElementById('videoPlayer').pause();
			this.undelegateEvents();
			$(this).empty;
			this.unbind();
		};
