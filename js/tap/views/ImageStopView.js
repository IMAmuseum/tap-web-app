/*
 * Backbone View for displaying an Image Stop
 * Relies on the PhotoSwipe jquery plugin
 */
TapAPI.classes.views.ImageStopView = TapAPI.classes.views.BaseView.extend({
    id: 'gallery-container',
    template: TapAPI.templateManager.get('image-stop'),
    initialize: function(options) {
        this._super(options);
    },
    render: function() {
        var assetRefs = this.model.get('assetRef');
        var description = this.model.get('description');

        if (_.isEmpty(assetRefs)) return this;

        var images = [];
        _.each(assetRefs, function(assetRef) {
            var asset = TapAPI.tourAssets.get(assetRef.id);

            if (assetRef.usage === 'image_asset') {
                var thumbnail = asset.getSourcesByPart('thumbnail');
                var image = asset.getSourcesByPart('image');
                var title = asset.getContentsByPart('title');
                var caption = asset.getContentsByPart('caption');

                var imageAsset = {
                    thumbnailUri: _.isEmpty(thumbnail) ? '' : thumbnail[0].get('uri'),
                    originalUri: _.isEmpty(image) ? '' : image[0].get('uri'),
                    title: _.isEmpty(title) ? '' : title[0].get('data'),
                    caption: _.isEmpty(caption) ? '' : caption[0].get('data')
                };
                images.push(imageAsset);
            }
        });

        this.$el.html(this.template({
            title: this.model.get('title'),
            images: images,
            nextStopPath: this.getNextStopPath(),
            description: description
        }));

        this.gallery = this.$el.find('a.gallery-link').photoSwipe({
            enableMouseWheel: false,
            enableKeyboard: true,
            doubleTapZoomLevel : 0,
            captionAndToolbarFlipPosition: false,
            captionAndToolbarShowEmptyCaptions: false,
            captionAndToolbarOpacity : 0.8,
            minUserZoom : 0.0,
            preventSlideshow : true,
            jQueryMobile : true,
            getImageCaption : function(el) {
                var caption = $(el).find("img").data("caption");
                var captionEl = document.createElement('div');
                $(captionEl).html(caption);
                return captionEl;
            }
        });
        return this;
    }
});
