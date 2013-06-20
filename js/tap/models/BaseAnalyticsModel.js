/*
 * Base Model Class for Analytics
 */
TapAPI.classes.models.BaseAnalyticsModel = Backbone.Model.extend({
    defaults: {
        'trackerId': null,
        'timer': {}
    },

    initialize: function() {

    },

    trackPageView: function(pagePath, pageTitle) {

    },

    trackEvent: function(category, action, label, value) {

    },

    createTimer: function(category, variable, optLabel) {
        this.set('timer', {
            category: category,
            variable: variable,
            label: optLabel ? optLabel : undefined,
            startTime: null,
            elapsed: 0,
            minThreshold: null,
            maxThreshold: null,
            minClamp: false,
            maxClamp: true
        });
        return this;
    },

    setTimerOption: function(key, value) {
        var timer = this.get('timer');
        timer[key] = value;
        this.set('timer', timer);
        return this;
    },

    startTimer: function() {
        var timer = this.get('timer');
        timer.startTime = new Date().getTime();
        this.set('timer', timer);
        return this;
    },

    stopTimer: function() {
        var timer = this.get('timer');
        if (timer.startTime !== null) {
            timer.elapsed = timer.elapsed + (new Date().getTime()) - timer.startTime;
            timer.startTime = null;
            this.set('timer', timer);
        }
        return this;
    },

    resetTimer: function() {
        var timer = this.get('timer');
        timer.elapsed = 0;
        this.set('timer', timer);
        return this;
    },

    trackTime: function() {
        this.stopTimer(); // update the timer

        var timer = this.get('timer');

        // If threshold criteria are not met, do not send
        if (((timer.minThreshold === null) || timer.minClamp || (timer.elapsed >= timer.minThreshold)) &&
        ((timer.maxThreshold === null) || timer.maxClamp || (timer.elapsed <= timer.maxThreshold))) {
            // At this point, we should clamp
            if ((timer.minThreshold !== null) && (timer.elapsed < timer.minThreshold)) timer.elapsed = timer.minThreshold;
            if ((timer.maxThreshold !== null) && (timer.elapsed > timer.maxThreshold)) timer.elapsed = timer.maxThreshold;

            if (_.isFunction(this.sendTimer)) {
                this.sendTimer();
            }
        }

        this.startTimer(); // keep the timer running

        return this;
    }
});