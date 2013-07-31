/*
 * Backbone View for displaying a Video Stop
 * Relies on the MediaElement plugin
 */
TapAPI.classes.views.VideoStopView = TapAPI.classes.views.BaseView.extend({
    id: 'video-stop',
    template: TapAPI.templateManager.get('video'),
    initialize: function(options) {
        this._super(options);

        this.mediaOptions = {
            defaultVideoWidth: '220',
            defaultVideoHeight: '200',
            flashName: mejs.MediaElementDefaults.flashName,
            silverlightName: mejs.MediaElementDefaults.flashName
        };

        TapAPI.tracker.createTimer('VideoStop', 'played_for', TapAPI.currentStop.id);
    },
    render: function() {
        // Find the transcription if one exists
        var transcription = '';
        var transcriptAsset = this.model.getAssetsByUsage('transcription');
        if (!_.isEmpty(transcriptAsset)) {
            transcription = transcriptAsset[0].get('content').at(0).get('data');
        }

        // Find the poster image if one exists
        var posterImagePath = '';
        var posterImageAsset = this.model.getAssetsByUsage('image');
        if (!_.isEmpty(posterImageAsset)) {
            posterImagePath = posterImageAsset[0].get('source').at(0).get('uri');
        }

        mediaAsset = this.model.getAssetsByType("video");
        if (_.isEmpty(mediaAsset)) {
            console.log('No media found.');
            return this;
        }

        var sources = [];
        _.each(mediaAsset[0].get("source").models, function(source) {
            sources.push('<source src="' + source.get('uri') + '" type="' + source.get('format') + '" />');
        });

        var description = this.model.get('description');

        // Render from the template
        this.$el.html(this.template({
            title: this.model.get('title'),
            transcription: transcription,
            imagePath: posterImagePath,
            sources: sources,
            description: description,
            nextStopPath: this.getNextStopPath()
        }));

        return this;
    },
    finishedAddingContent: function() {
        var that = this,
            mediaElement = $('.player').get(0);

        // add event handlers for media player events
        mediaElement.addEventListener('loadedmetadata', function() {
            TapAPI.tracker.setTimerOption('maxThreshold', mediaElement.duration * 1000);
        });

        mediaElement.addEventListener('play', function() {
            var label = _.isObject(TapAPI.currentStop) ? TapAPI.currentStop.get("title") : null;
            TapAPI.tracker.trackEvent('VideoStop', 'media_started', label, null);
            TapAPI.tracker.startTimer();
        });

        mediaElement.addEventListener('pause', function() {
            var label = _.isObject(TapAPI.currentStop) ? TapAPI.currentStop.get("title") : null;
            TapAPI.tracker.stopTimer();
            var timer = TapAPI.tracker.get('timer');
            TapAPI.tracker.trackEvent('VideoStop', 'media_paused', label, timer.elapsed);
        });

        mediaElement.addEventListener('ended', function() {
            var label = _.isObject(TapAPI.currentStop) ? TapAPI.currentStop.get("title") : null;
            TapAPI.tracker.stopTimer();
            var timer = TapAPI.tracker.get('timer');
            TapAPI.tracker.trackEvent('VideoStop', 'media_ended', label, timer.elapsed);
        });

        // Add click handler on the transcription toggle button
        this.$el.find('#transcription').on('expand', function(e, ui) {
            var label = _.isObject(TapAPI.currentStop) ? TapAPI.currentStop.get("title") : null;
            TapAPI.tracker.trackEvent('VideoStop', 'show_transcription', label, null);
        });

        that.player = new MediaElementPlayer('.player', {
            defaultVideoWidth: '220',
            defaultVideoHeight: '200',
            pluginPath: TapAPI.media.pluginPath,
            flashName: 'flashmediaelement.swf',
            silverlightName: 'silverlightmediaelement.xap',
            success: function (mediaElement, domObject, elems) {
                if (mediaElement.pluginType === 'youtube') {
                    $(elems.container).find('.mejs-poster').hide();
                }
            }
        });
        this.player.play();
    },
    onClose: function() {
        // Send information about playback duration when the view closes
        TapAPI.tracker.trackTime();
    }
});