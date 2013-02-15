define([], function() {
    return {
        url: '../../tour.xml',
        trackerID: 'UA-20840633-3',
        viewRegistry: {
            'tour_audio_stop': {
                view: 'AudioStopView',
                icon: ''
            },
            'tour_image_stop': {
                view: 'ImageStopView',
                icon: ''
            },
            'tour_stop_group': {
                view: 'StopGroupView',
                icon: ''
            },
            'tour_video_stop': {
                view: 'VideoStopView',
                icon: ''
            }
        }
    };
});