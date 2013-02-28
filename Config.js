define([], function() {
    return {
        tourMLEndpoint: '../../tour.xml',
        trackerID: '',
        geo: {},
        social: {},
        tourSettings: {
            'tour-1': {
                'defaultNavigationController': 'StopListView',
                'enabledNavigationControllers': ['StopListView', 'MapView']
            }
        },
        navigationControllers: {},
        viewRegistry: {}
    };
});