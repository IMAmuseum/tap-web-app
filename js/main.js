requirejs.config({
    paths: {
        'jquery': 'vendor/jquery',
        'jquerymobile': 'vendor/jqmobile/jquery.mobile',
        'json2': 'vendor/json2',
        'underscore': 'vendor/underscore',
        'backbone': 'vendor/backbone',
        'backbone.localStorage': 'vendor/backbone.localStorage',
        'backbone-super': 'vendor/backbone-super'
    },
    shim: {
        'backbone.localStorage': {
            deps: ['backbone'],
            exports: 'Backbone.LocalStorage'
        },
        'backbone-super': {
            deps: ['backbone'],
            exports: 'Backbone.Super'
        }
    }
});

require([
    'jquery',
    'jquerymobile',
    'backbone',
    'tap/app'
], function($, jQMobile, Backbone, App) {
    $.mobile.ajaxEnabled = false;
    // Prevents all anchor click handling
    $.mobile.linkBindingEnabled = false;
    // Disabling this will prevent jQuery Mobile from handling hash changes
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;

    App.initialize();
    blah = App;
});