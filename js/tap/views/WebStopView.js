/*
 * Backbone View for displaying a Web Stop (generic web content)
 */
TapAPI.classes.views.WebStopView = TapAPI.classes.views.BaseView.extend({
    id: 'web-stop',
    template: TapAPI.templateManager.get('web'),
    initialize: function(options) {
        this._super(options);
        this.title = this.model.get('title');
    },
    render: function() {
        var html = '';
        var htmlAsset = this.model.getAssetsByUsage('web_content');
        if (!_.isEmpty(htmlAsset)) {
            html = htmlAsset[0].get('content').at(0).get('data');
        }
        this.$el.html(this.template({
            title: this.model.get('title'),
            html: html,
            nextStopPath: this.getNextStopPath()
        }));
        return this;
    }
});