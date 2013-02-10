requirejs.config({
    paths: {
        'jquery': 'vendor/jquery',
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

require(['jquery', 'tap/app'], function($, App){
    //App.initialize();
    console.log($);
});