define([
    'underscore',
    'tap/Config'
], function(_, Config) {
    var TapAPI = {
        tours: {},
        tourAssets: {},
        tourStops: {},
        language: 'en',
        currentStop: '',
        currentTour: '',
        collections: {},
        models: {},
        views: {},
        templates: {},
        navigationControllers: [
            { view: 'KeypadView', label: 'Keypad', defaultView: true},
            { view: 'StopListView', label: 'Stop List'},
            { view: 'MapView', label: 'Map'}
        ],
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