/*
 * Backbone View for displaying a Stop group
 */
TapAPI.classes.views.StopGroupView = TapAPI.classes.views.BaseView.extend({
    id: 'stop-group',
    template: TapAPI.templateManager.get('stop-group'),
    initialize: function(options) {
        this._super(options);
        this.hasAudio = false;
        this.hasMultiImage = false;
    },
    render: function() {
        var stops = [],
            header,
            that = this;
        var description = this.model.get('description');

        var headerAsset = this.model.getAssetsByUsage('header_image');
        if (!_.isUndefined(headerAsset)) {
            header = headerAsset[0].get('source').at(0).get('uri');
        }

        _.each(this.model.get('connection'), function(connection) {
            var stop = TapAPI.tourStops.get(connection.destId);
            if (stop) {
                stops.push({
                    id: stop.get('id'),
                    title: stop.get('title'),
                    icon: TapAPI.viewRegistry[stop.get('view')].icon,
                    route: stop.getRoute()
                });
            }
        });

        //for multi-image support
        var imageAssets = this.model.getAssetsByUsage('image_asset');
        var images = [];
        _.each(imageAssets, function(asset) {
            var image = asset.getSourcesByPart('image');
            var title = asset.getContentsByPart('title');
            var caption = asset.getContentsByPart('caption');

            var imageAsset = {
                originalUri: _.isEmpty(image) ? '' : image[0].get('uri'),
                title: _.isEmpty(title) ? '' : title[0].get('data'),
                caption: _.isEmpty(caption) ? '' : caption[0].get('data')
            };
            images.push(imageAsset);
            that.hasMultiImage = true;
        });

        //for audio support
        var audioAsset = this.model.getAssetsByType('audio');

        // Get audio element sources and determine template
        var audioSources = [];
        var transcription = '';
        if (!_.isUndefined(audioAsset)) {
            _.each(audioAsset[0].get('source').models, function(source) {
                audioSources.push('<source src="' + source.get('uri') + '" type="' + source.get('format') + '" />');
                that.hasAudio = true;
            });


            // Find the transcription if one exists
            var transcriptAsset = this.model.getAssetsByUsage('transcription');
            if (!_.isEmpty(transcriptAsset)) {
                transcription = transcriptAsset[0].get('content').at(0).get('data');
            }
        }

        //render the stop
        this.$el.html(this.template({
            header: header,
            title: this.model.get('title'),
            tourID: TapAPI.currentTour,
            description: _.isEmpty(description) ? '' : description,
            stops: stops,
            images: images,
            audioSources: audioSources,
            transcription: transcription
        }));

        return this;
    },
    finishedAddingContent: function() {
        if (this.hasMultiImage) {
            $(".rslides").responsiveSlides({
                auto: false,             // Boolean: Animate automatically, true or false
                pager: true,           // Boolean: Show pager, true or false
                nav: false             // Boolean: Show navigation, true or false
            });
        }

        if (this.hasAudio) {
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
        }
    }
});