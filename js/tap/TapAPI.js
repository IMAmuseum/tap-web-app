define([
    'underscore',
    'tap/Config'
], function(_, Config) {
    var TapAPI = {
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
        navigationControllers: [
            { view: 'KeypadView', label: 'Keypad', icon: '', defaultView: true},
            { view: 'StopListView', label: 'Stop List', icon: ''},
            { view: 'MapView', label: 'Map', icon: '' }
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