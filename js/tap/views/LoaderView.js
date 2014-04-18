/*
 * Backbone View for displaying the footer tab bar
 */
TapAPI.classes.views.LoaderView = Backbone.View.extend({
    id: 'loader',
    template: TapAPI.templateManager.get('loader'),
    attributes: {
        'data-role': 'loader',
        'data-position': 'fixed',
    },
    template: TapAPI.templateManager.get('loader'),
    initialize: function() {
        this.listenTo(Backbone, 'tap.displayLoader', this.displayLoader);
        this.listenTo(Backbone, 'tap.removeLoader', this.removeLoader);
    },
    render: function(view) {
        this.$el.html(this.template({}));
        return this;
    },

    displayLoader : function () {
        $.mobile.loading("show", {
            text: 'Loading tours',
            textVisible: true,
            theme: 'a'
        });
    },
    removeLoader : function () {
        $.mobile.loading("hide");
    }
});