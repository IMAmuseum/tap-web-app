define([
    'underscore',
    'tap/Config'
], function(_, Config) {
    var TapAPI = {
        gaq: [],
        router: undefined,
        tours: {},
        tourAssets: {},
        tourStops: {},
        language: 'es',
        currentStop: '',
        currentTour: '',
        collections: {},
        models: {},
        views: {},
        templates: {},
        config: _.defaults(Config, {
            defaultLanguage: 'en',
            url: '',
            trackerID: '',
            tourSettings: {},
            viewRegistry: {
                'tour_audio_stop': 'AudioStopView',
                'tour_image_stop': 'ImageStopView',
                'tour_stop_group': 'StopGroupView',
                'tour_video_stop': 'VideoStopView'
            }
        })
    };
    return TapAPI;
});