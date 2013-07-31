/*
 * Backbone View for displaying an Audio Stop
 * Relies on the MediaElement Plugin
 */
TapAPI.classes.views.AudioStopView = TapAPI.classes.views.BaseView.extend({
    id: 'audio-stop',
    initialize: function(options) {
        this._super(options);

        TapAPI.tracker.createTimer('AudioStop', 'played_for', TapAPI.currentStop.id);
    },
    render: function() {
        // Find the transcription if one exists
        var transcription = '';
        var transcriptAsset = this.model.getAssetsByUsage('transcription');
        if (!_.isEmpty(transcriptAsset)) {
            transcription = transcriptAsset[0].get('content').at(0).get('data');
        }

        var description = this.model.get('description');

        // Find the poster image if one exists
        var posterImagePath = '';
        var posterImageAsset = this.model.getAssetsByUsage('image');
        if (!_.isEmpty(posterImageAsset)) {
            posterImagePath = posterImageAsset[0].get('source').at(0).get('uri');
        }

        var mediaAsset = this.model.getAssetsByType(['audio', 'video']);

        if (_.isEmpty(mediaAsset)) {
            console.log('No media found.');
            return this;
        }

        // Get media element sources and determine template
        var sources = [];
        var mediaTemplate = '';
        _.each(mediaAsset[0].get('source').models, function(source) {
            if (mediaTemplate === '') {
                if(source.get('format').indexOf('audio') >= 0) {
                    mediaTemplate = 'audio';
                } else {
                    mediaTemplate = 'video';
                }
            }
            sources.push('<source src="' + source.get('uri') + '" type="' + source.get('format') + '" />');
        });

        this.template = TapAPI.templateManager.get(mediaTemplate);

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
            mediaElement = $('.player')[0];

        // add event handlers for media player events
        mediaElement.addEventListener('loadedmetadata', function() {
            TapAPI.tracker.setTimerOption('maxThreshold', mediaElement.duration * 1000);
        });

        mediaElement.addEventListener('play', function() {
            var label = _.isObject(TapAPI.currentStop) ? TapAPI.currentStop.get("title") : null;
            TapAPI.tracker.trackEvent('AudioStop', 'media_started', label, null);
            TapAPI.tracker.startTimer();
        });

        mediaElement.addEventListener('pause', function() {
            var label = _.isObject(TapAPI.currentStop) ? TapAPI.currentStop.get("title") : null;
            TapAPI.tracker.stopTimer();
            var timer = TapAPI.tracker.get('timer');
            TapAPI.tracker.trackEvent('AudioStop', 'media_paused', label, timer.elapsed);
        });

        mediaElement.addEventListener('ended', function() {
            var label = _.isObject(TapAPI.currentStop) ? TapAPI.currentStop.get("title") : null;
            TapAPI.tracker.stopTimer();
            var timer = TapAPI.tracker.get('timer');
            TapAPI.tracker.trackEvent('AudioStop', 'media_ended', label, timer.elapsed);
        });

        // Add expand handler on the transcription toggle button
        this.$el.find('#transcription').on('expand', function(e, ui) {
            var label = _.isObject(TapAPI.currentStop) ? TapAPI.currentStop.get("title") : null;
            TapAPI.tracker.trackEvent('AudioStop', 'show_transcription', label, null);
        });

        this.player = new MediaElementPlayer('.player', {
            pluginPath: TapAPI.media.pluginPath,
            flashName: 'flashmediaelement.swf',
            silverlightName: 'silverlightmediaelement.xap'
        });
        this.player.play();
    },
    close: function() {
        // Send information about playback duration when the view closes
        TapAPI.tracker.trackTime();
    }
});