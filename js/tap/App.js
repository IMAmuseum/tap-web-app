define([], function(){
    return {
        gaq: [],
        router: undefined,
        tap: {
            tours: {},
            tourAssets: {},
            tourStops: {},
            language: 'es',
            defaultLanguage: 'en',
            currentStop: '',
            currentTour: ''
        },
        collections: {},
        models: {},
        views: {}
    };
});