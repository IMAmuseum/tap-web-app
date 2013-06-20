/*
 * Google Analytics Model Class
 */
TapAPI.classes.models.GAModel = TapAPI.classes.models.BaseAnalyticsModel.extend({
	initialize: function() {
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments);},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', this.get('trackerId'));
    },

    trackPageView: function(pagePath, pageTitle) {
        ga('send', 'pageview', pagePath, pageTitle);
    },

    trackEvent: function(category, action, label, value) {
        ga('send', 'event', category, action, label, value);
    },

    sendTimer: function() {
        var timer = this.get('timer');
        ga('send', 'timing', timer.category, timer.variable, timer.elapsed, timer.optLabel);
    }
});