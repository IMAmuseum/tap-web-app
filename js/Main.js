requirejs.config({
    waitSeconds: 45,
    paths: {
        'jquery': '../vendor/jquery',
        'jquerymobile': '../vendor/jqmobile/jquery.mobile',
        'json2': '../vendor/json2',
        'underscore': '../vendor/underscore',
        'backbone': '../vendor/backbone',
        'localStorage': '../vendor/backbone.localStorage',
        'backbone-super': '../vendor/backbone-super',
        'leaflet': '../vendor/leaflet/leaflet',
        'klass': '../vendor/klass',
        'photoswipe': '../vendor/photoswipe/code.photoswipe',
        'mediaelement': '../vendor/mediaelement/mediaelement-and-player',
        'jqm-config': 'tap/JQMConfig',
        'config': '../Config'
    },
    shim: {
        'backbone-super': {
            deps: ['backbone']
        },
        'leaflet': {
            exports: 'leaflet'
        },
        'photoswipe': {
            deps: ['jquery', 'klass'],
            exports: 'photoswipe'
        },
        'mediaelement': {
            deps: ['jquery'],
            exports: 'mediaelement'
        }
    }
});

require([
    'jquery',
    'tap/TapAPI',
    'tap/views/AppView',
    'tap/Router',
    'jqm-config',
    'jquerymobile'
], function($, TapAPI, AppView, Router) {
    AppView.runApp();
});