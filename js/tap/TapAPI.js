var TapAPI = {
    classes: {
        models: {},
        views: {},
        collections: {},
        routers: {},
        utility: {}
    },
    tours: {},
    tourAssets: {},
    tourStops: {},
    language: 'en',
    currentStop: null,
    currentTour: '',
    templates: {},
    // User Configurable
    defaultLanguage: _.isUndefined(TapConfig.defaultLanguage) ? 'en' : TapConfig.defaultLanguage,
    tourMLEndpoint: _.isUndefined(TapConfig.tourMLEndpoint) ? '' : TapConfig.tourMLEndpoint,
    tracker: null,
    trackerID: _.isUndefined(TapConfig.trackerID) ? '' : TapConfig.trackerID,
    trackerClass: _.isUndefined(TapConfig.trackerClass) ? 'GAModel' : TapConfig.trackerClass,
    primaryRouter: _.isUndefined(TapConfig.primaryRouter) ? 'Default' : TapConfig.primaryRouter,
    navigationControllers: {
        'StopListView': {
            label: 'Stop Menu',
            filterBy: 'stopGroup',
            sortBy: 'code',
            displayCodes: true
        },
        'KeypadView': {
            label: 'Keypad'
        },
        'MapView': {
            label: 'Map',
            showDirections: false
        }
    },
    tourSettings: TapConfig.tourSettings,
    viewRegistry: {
        'audio_stop': {
            view: 'AudioStopView',
            icon: 'images/audio.png'
        },
        'image_stop': {
            view: 'ImageStopView',
            icon: 'images/photo.png'
        },
        'stop_group': {
            view: 'StopGroupView',
            icon: 'images/list.png'
        },
        'video_stop': {
            view: 'VideoStopView',
            icon: 'images/video.png'
        },
        'web_stop': {
            view: 'WebStopView',
            icon: 'images/web.png'
        },
        'audio_slideshow_stop': {
            view: 'AudioSlideshowStopView',
            icon: 'images/audio.png'
        }
    },
    media: {
        pluginPath: 'vendor/mediaelement/'
    },
    geo: {
        units: 'metric'
    },
    social: {
        enabled: false,
        title: 'Share TAP',
        facebook: {
            appID: ''
        }
    }
};

// attempt to get user defined media configurations
if (!_.isUndefined(TapConfig.media)) {
    _.extend(TapAPI.media, TapConfig.media);
}

// attempt to get user defined social configurations
if (!_.isUndefined(TapConfig.social)) {
    _.extend(TapAPI.social, TapConfig.social);
}

// attempt to get user defined view registry
if (!_.isUndefined(TapConfig.viewRegistry)) {
    _.extend(TapAPI.viewRegistry, TapConfig.viewRegistry);
}

// attempt to get user defiend navigation controllers
if (!_.isUndefined(TapConfig.navigationControllers)) {
    _.extend(TapAPI.navigationControllers, TapConfig.navigationControllers);
}

// attempt to get user defiend social settings
if (!_.isUndefined(TapConfig.social)) {
    _.extend(TapAPI.social, TapConfig.social);
}