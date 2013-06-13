/*
 * Backbone View for displaying an Audio Stop
 * Relies on the MediaElement Plugin
 */
TapAPI.classes.views.audioStopView = TapAPI.classes.views.baseView.extend({
    id: 'audio-stop',
    initialize: function() {
        this._super('initialize');

        this.timer = new AnalyticsTimer('AudioStop', 'played_for', TapAPI.currentStop.id);
        this.timer.reset();
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
            description: description
        }));

        return this;
    },
    finishedAddingContent: function() {
        var that = this,
            mediaElement = $('.player')[0];

        // add event handlers for media player events
        mediaElement.addEventListener('loadedmetadata', function() {
            that.timer.maxThreshold = mediaElement.duration * 1000;
        });

        mediaElement.addEventListener('play', function() {
            _gaq.push(['_trackEvent', 'AudioStop', 'media_started']);
            that.timer.start();
        });

        mediaElement.addEventListener('pause', function() {
            _gaq.push(['_trackEvent', 'AudioStop', 'media_paused']);
            that.timer.stop();
        });

        mediaElement.addEventListener('ended', function() {
            _gaq.push(['_trackEvent', 'AudioStop', 'media_ended']);
        });

        // Add expand handler on the transcription toggle button
        this.$el.find('#transcription').on('expand', function(e, ui) {
            _gaq.push(['_trackEvent', 'AudioStop', 'show_transcription']);
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
        this.timer.send();
    }
});