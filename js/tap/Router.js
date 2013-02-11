define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    var router = Backbone.Router.extend({
        routes: {
            '': 'list',
            'map': 'map',
            'tour/:tour_id': 'tourDetails',
            'tourkeypad/:tour_id': 'tourKeypad',
            'tourstop/:tour_id/:stop_id': 'tourStopById',
            'tourstop/:tour_id/code/:stop_code': 'tourStopByCode',
            'tourmap/:tour_id': 'tourMap',
            'tourstoplist/:tour_id': 'tourStopList'
        },
        initialize: function() {

        },
        /**
         * Route to the tour listing
         */
        list: function() {

        },
        /**
         * Route to the overall map view
         */
        map: function() {

        },
        /**
         * Route to the tour details
         * @param id The id of the tour
         */
        tourDetails: function(id) {

        },
        /**
         * Route to the keypad
         * @param id The id of the tour
         */
        tourKeypad: function(id) {

        },
        /**
         * Route to a stop
         */
        tourStop: function() {

        },
        /**
         * Route to a stop by stop ID
         **/
        tourStopById: function(tour_id, stop_id) {

        },
        /**
         * Route to a stop by stop code
         */
        tourStopByCode: function(tour_id, stop_code) {

        },
        /**
         * Route to the tour list
         * @param id The id of the tour
         */
        tourStopList: function(id) {

        },
        /**
         * Route to the tour map
         * Certain parameters are determined here in the router to leave open the possibility of
         * plotting markers for several tours on the same map
         */
        tourMap: function(id) {

        },
        changePage: function(page) {

        }
    });
    return router;
});