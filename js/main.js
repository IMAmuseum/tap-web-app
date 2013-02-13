requirejs.config({
    paths: {
        'jquery': 'vendor/jquery',
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
    'tap/views/AppView',
    'jquerymobile'
], function($, App) {
    // disable misc jQuery Mobile functionality so that we can handle it ourselves
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;
    console.log(App);
    App.render();
    console.log(App);
    // start backbone history collection
    Backbone.history.start();
});