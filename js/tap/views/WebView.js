define([
    'jquery',
    'underscore',
    'backbone',
    'tap/TapAPI',
    'tap/views/BaseView'
], function($, _, Backbone, TapAPI, BaseView) {
    var webStopView = BaseView.extend({
        id: 'web-stop',
        initialize: function() {
            this._super('initialize');
            this.title = this.model.get('title');
        },
        render: function() {
            var html = '';
            var htmlAsset = this.model.getAssetsByUsage('web_content');
            if (!_.isEmpty(htmlAsset)) {
                html = htmlAsset[0].get('content').at(0).get('data');
            }
            this.$el.html(html);
            return this;
        }
    });
    return webStopView;
});