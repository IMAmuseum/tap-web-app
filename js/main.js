requirejs.config({
    paths: {
        'jquery': 'vendor/jquery',
        'jqm-config': 'tap/JQMConfig',
        'jquerymobile': 'vendor/jqmobile/jquery.mobile',
        'json2': 'vendor/json2',
        'underscore': 'vendor/underscore',
        'backbone': 'vendor/backbone',
        'localstorage': 'vendor/backbone.localStorage',
        'backbone-super': 'vendor/backbone-super',
        'leaflet': 'vendor/leaflet/leaflet',
        'photoswipe': 'vendor/photoswipe/code.photoswipe.jquery',
        'mediaelement': 'vendor/mediaelement/mediaelement-and-player'
    },
    shim: {
        'jquerymobile': {
            deps: ['jqm-config']
        },
        'backbone-super': {
            deps: ['backbone'],
            exports: 'super'
        },
        'leaflet': {
            exports: 'leaflet'
        },
        'photoswipe': {
            exports: 'photoswipe'
        },
        'mediaelement': {
            exports: 'mediaelement'
        }
    }
});

require([
    'jquery',
    'tap/TapAPI',
    'tap/views/AppView',
    'tap/router',
    'jquerymobile'
], function($, TapAPI, AppView, Router) {
    AppView.runApp();
});