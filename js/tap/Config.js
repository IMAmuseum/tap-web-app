define([], function() {
    return {
        url: '../../tour.xml',
        trackerID: 'UA-20840633-3',
        navigationControllers: [
            { label: 'Keypad', endpoint: '', icon: '' },
            { label: 'StopList', endpoint: '', icon: '' },
            { label: 'Map', endpoint: '', icon: '' }
        ],
        viewRegistry: {
            'tour_audio_stop': {
                view: 'AudioStopView',
                icon: 'images/audio.png'
            },
            'tour_image_stop': {
                view: 'ImageStopView',
                icon: 'images/photo.png'
            },
            'tour_stop_group': {
                view: 'StopGroupView',
                icon: 'images/list.png'
            },
            'tour_video_stop': {
                view: 'VideoStopView',
                icon: 'images/video.png'
            }
        }
    };
});