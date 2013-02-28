define([
    'jquery',
    'underscore',
    'backbone',
    'tap/TapAPI',
    'tap/TemplateManager',
    'tap/views/BaseView',
    'tap/AnalyticsTimer',
    'mediaelement'
], function($, _, Backbone, TapAPI, TemplateManager, BaseView, AnalyticsTimer) {
    var audioStopView = BaseView.extend({
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

            // Get media element sources
            var sources = [];
            _.each(mediaAsset[0].get('source').models, function(source) {
                sources.push('<source src="' + source.get('uri') + '" type="' + source.get('format') + '" />');
            });

            // get the appropriate template
            var mediaTemplate = '';
            if (mediaAsset[0].get('type') === 'audio') {
                mediaTemplate = 'audio';
                this.mediaOptions.defaultAudioWidth = '100%';
            } else {
                mediaTemplate = 'video';
                this.mediaOptions.defaultVideoWidth = '100%';
                this.mediaOptions.defaultVideoHeight = 270;
            }
            this.template = TemplateManager.get(mediaTemplate);

            // Render from the template
            this.$el.html(this.template({
                title: this.model.get('title'),
                transcription: transcription,
                imagePath: posterImagePath,
                sources: sources
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
    return audioStopView;
});