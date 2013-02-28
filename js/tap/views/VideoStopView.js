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
    var videoStopView = BaseView.extend({
        id: 'video-stop',
        template: TemplateManager.get('video'),
        initialize: function() {
            this._super('initialize');

            this.mediaOptions = {
                defaultVideoWidth: '220',
                defaultVideoHeight: '200',
                flashName: mejs.MediaElementDefaults.flashName,
                silverlightName: mejs.MediaElementDefaults.flashName
            };

            this.timer = new AnalyticsTimer('VideoStop', 'played_for', TapAPI.currentStop.id);
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

            mediaAsset = this.model.getAssetsByType("video");
            if (_.isEmpty(mediaAsset)) {
                console.log('No media found.');
                return this;
            }

            var sources = [];
            _.each(mediaAsset[0].get("source").models, function(source) {
                sources.push('<source src="' + source.get('uri') + '" type="' + source.get('format') + '" />');
            });

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
                mediaElement = $('.player').get(0);

            // add event handlers for media player events
            mediaElement.addEventListener('loadedmetadata', function() {
                that.timer.maxThreshold = mediaElement.duration * 1000;
            });

            mediaElement.addEventListener('play', function() {
                _gaq.push(['_trackEvent', 'VideoStop', 'media_started']);
                that.timer.start();
            });

            mediaElement.addEventListener('pause', function() {
                _gaq.push(['_trackEvent', 'VideoStop', 'media_paused']);
                that.timer.stop();
            });

            mediaElement.addEventListener('ended', function() {
                _gaq.push(['_trackEvent', 'VideoStop', 'media_ended']);
            });

            // Add click handler on the transcription toggle button
            this.$el.find('#transcription').on('expand', function(e, ui) {
                _gaq.push(['_trackEvent', 'VideoStop', 'show_transcription']);
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
            this.timer.send();
        }
    });
    return videoStopView;
});