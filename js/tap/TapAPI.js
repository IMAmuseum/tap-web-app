define([
    'underscore',
    'tap/Config'
], function(_, Config) {
    var TapAPI = {
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
            viewRegistry: {}
        })
    };

    return TapAPI;
});