/*
 * Backbone View for displaying an Audio Slideshow Stop
 */
TapAPI.classes.views.AudioSlideshowStopView = TapAPI.classes.views.BaseView.extend({
    id: 'audio-slideshow-stop',
    template: TapAPI.templateManager.get("audioSlideshow"),
    initialize: function(options) {
        this._super(options);
        this.audioPlayer = null;
        this.imageData = {};
        this.images = [];
        this.currentImage;
        // TapAPI.tracker.createTimer('AudioStop', 'played_for', TapAPI.currentStop.id);
    },
    render: function() {
        var description = this.model.get('description');

        var queuePoints = this.model.getAssetsByUsage('queue_points');
        var timings = [];
        if (!_.isEmpty(queuePoints)) {
            queuePoints = queuePoints[0];
            queuePoints.get('content').each(function(qPt) {
                timings.push(parseInt(qPt.get('data'), 10));
            });
        }

        // Find the images
        var posterImagePath = '';
        var imageAssets = this.model.getAssetsByUsage('image_asset');
        var imageSources = {};
        var offset = 0;
        if (!_.isEmpty(imageAssets)) {
            for (var i = 0, numImages = imageAssets.length; i < numImages; i++) {
                var imageSource = imageAssets[i].getSourcesByPart('image');
                var imageUri = imageSource[0].get('uri');
                var imageProperties = imageSource[0].get('propertySet');
                var imageDimensions = {width:0, height:0, aspect:1};
                imageProperties.each(function(imgProp) {
                    if (imgProp.get('name') == 'width') {
                        imageDimensions.width = parseInt(imgProp.get('value'), 10);
                    } else if (imgProp.get('name') == 'height') {
                        imageDimensions.height = parseInt(imgProp.get('value'), 10);
                    }
                });
                var landscape = false;
                if (imageDimensions.width > imageDimensions.height) {
                    landscape = true;
                }
                imageDimensions.aspect = imageDimensions.width / imageDimensions.height;

                var filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
                imageSources[filename] = {
                    start: offset,
                    end: offset + timings[i],
                    uri: imageUri,
                    id: 'imageSlide_' + i,
                    dimensions: imageDimensions,
                    orientation: landscape ? 'l' : 'p'
                };
                offset += timings[i];
            }
        }
        this.imageData = imageSources;

        var audioAsset = this.model.getAssetsByType(['audio']);

        if (_.isEmpty(audioAsset)) {
            console.log('No audio found.');
            return this;
        }

        // Get media element sources and determine template
        var sources = [];
        var mediaTemplate = '';
        _.each(audioAsset[0].get('source').models, function(source) {
            sources.push('<source src="' + source.get('uri') + '" type="' + source.get('format') + '" />');
        });

        // Render from the template
        this.$el.html(this.template({
            title: this.model.get('title'),
            imageSources: imageSources,
            sources: sources,
            description: description,
            nextStopPath: this.getNextStopPath()
        }));

        return this;
    },
    finishedAddingContent: function() {
        var that = this;

        that.images = that.$el.find("img");

        var imageContainer = that.$el.find(".slideshow-images");
        var imageContainerDimensions = {
            height: imageContainer.height(),
            width: imageContainer.width()
        };

        _.each(that.images, function(img) {
            var $img = $(img);
            var imageData = _.find(that.imageData, function(image) {
                if (image.uri == $img.attr("src")) {
                    return true;
                }
            });

            var scaledWidth = imageContainerDimensions.height * imageData.dimensions.aspect;
            if (scaledWidth < imageContainerDimensions.width) {
                $img.css({
                    'left': (imageContainerDimensions.width - scaledWidth) / 2
                });
            }
        });

        that.audioPlayer = document.getElementById("audio-player");

        // this.player = new MediaElementPlayer('#audio-player', {
        //     pluginPath: TapAPI.media.pluginPath,
        //     flashName: 'flashmediaelement.swf',
        //     silverlightName: 'silverlightmediaelement.xap'
        // });
        that.audioPlayer.addEventListener('pause', function() {
            that.images.stop();
        });

        that.audioPlayer.addEventListener('timeupdate', function() {
            var audioTime = this.currentTime;
            var displayImage = _.find(that.imageData, function(image) {
                if (audioTime >= image.start && audioTime < image.end) {
                    return true;
                }
            });

            if (!_.isUndefined(displayImage)) {
                var paused = that.audioPlayer.paused;
                var sectionDuration = displayImage.end - audioTime;

                var imageElem = that.$el.find("#" + displayImage.id);
                if (_.isUndefined(that.currentImage) || that.currentImage.id != displayImage.id || paused) {
                    that.images.removeClass("opaque");
                    imageElem.addClass("opaque");
                    that.currentImage = displayImage;
                }

                if (displayImage.orientation == 'l' && !_.isUndefined(imageElem) && !imageElem.is(':animated')) {
                    var panFactor = (displayImage.end - displayImage.start) / sectionDuration;
                    var panDistance = -1 * ((imageContainerDimensions.height * displayImage.dimensions.aspect) - imageContainerDimensions.width) / panFactor;
                    if (panDistance < 0 && !paused) {
                        imageElem.animate(
                            {'left': panDistance + parseFloat(imageElem.css('left'))},
                            sectionDuration * 1000,
                            'swing',
                            function() {
                                var $that = $(this);
                                window.setTimeout(function() {
                                    $that.css({'left':0});
                                }, 1000);
                        });
                    } else {
                        imageElem.css({
                            'left': -1 * ((imageContainerDimensions.height * displayImage.dimensions.aspect) - imageContainerDimensions.width + panDistance)
                        });
                    }
                }
            }

        }, false);
        //     mediaElement = $('.player')[0];

        // // add event handlers for media player events
        // mediaElement.addEventListener('loadedmetadata', function() {
        //     TapAPI.tracker.setTimerOption('maxThreshold', mediaElement.duration * 1000);
        // });

        // mediaElement.addEventListener('play', function() {
        //     var label = _.isObject(TapAPI.currentStop) ? TapAPI.currentStop.get("title") : null;
        //     TapAPI.tracker.trackEvent('AudioStop', 'media_started', label, null);
        //     TapAPI.tracker.startTimer();
        // });

        // mediaElement.addEventListener('pause', function() {
        //     var label = _.isObject(TapAPI.currentStop) ? TapAPI.currentStop.get("title") : null;
        //     TapAPI.tracker.stopTimer();
        //     var timer = TapAPI.tracker.get('timer');
        //     TapAPI.tracker.trackEvent('AudioStop', 'media_paused', label, timer.elapsed);
        // });

        // mediaElement.addEventListener('ended', function() {
        //     var label = _.isObject(TapAPI.currentStop) ? TapAPI.currentStop.get("title") : null;
        //     TapAPI.tracker.stopTimer();
        //     var timer = TapAPI.tracker.get('timer');
        //     TapAPI.tracker.trackEvent('AudioStop', 'media_ended', label, timer.elapsed);
        // });

        // // Add expand handler on the transcription toggle button
        // this.$el.find('#transcription').on('expand', function(e, ui) {
        //     var label = _.isObject(TapAPI.currentStop) ? TapAPI.currentStop.get("title") : null;
        //     TapAPI.tracker.trackEvent('AudioStop', 'show_transcription', label, null);
        // });


        // this.player.play();
    },
    close: function() {
        // Send information about playback duration when the view closes
        // TapAPI.tracker.trackTime();
    }
});