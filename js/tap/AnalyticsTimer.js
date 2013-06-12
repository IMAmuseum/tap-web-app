function AnalyticsTimer(category, variable, optLabel) {
    this.category = category;
    this.variable = variable;
    this.label = optLabel ? optLabel : undefined;
    this.startTime = null;
    this.elapsed = 0;
    this.minThreshold = null;
    this.maxThreshold = null;
    this.minClamp = false;
    this.maxClamp = true;
}

AnalyticsTimer.prototype.start = function() {
    this.startTime = new Date().getTime();
    return this;
};

AnalyticsTimer.prototype.stop = function() {
    if (this.startTime !== null) {
      this.elapsed = this.elapsed + (new Date().getTime()) - this.startTime;
      this.startTime = null;
    }
    return this;
};

AnalyticsTimer.prototype.reset = function() {
    this.elapsed = 0;
    return this;
};

AnalyticsTimer.prototype.send = function() {
    this.stop(); // update the timer

    // If threshold criteria are not met, do not send
    if (((this.minThreshold === null) || this.minClamp || (this.elapsed >= this.minThreshold)) &&
        ((this.maxThreshold === null) || this.maxClamp || (this.elapsed <= this.maxThreshold))) {
        // At this point, we should clamp
        if ((this.minThreshold !== null) && (this.elapsed < this.minThreshold)) this.elapsed = this.minThreshold;
        if ((this.maxThreshold !== null) && (this.elapsed > this.maxThreshold)) this.elapsed = this.maxThreshold;

        _gaq.push(['_trackTiming', this.category, this.variable, this.elapsed, this.label]);

    }

    this.start(); // keep the timer running

    return this;
};