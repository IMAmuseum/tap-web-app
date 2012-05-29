// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //

jQuery(function() {
	// setup a tour stop view
	TapAPI.views.Stop = Backbone.View.extend({
		el: $('#tour-stop').find(":jqmData(role='content')"),
		template: _.template($('#tour-stop-tpl').html()),
		render: function() {
			this.$el.html(this.template({
				tourStopTitle : tap.currentStop.get("title") ? tap.currentStop.get("title")[0].value : undefined,
				tourStopDescription : tap.currentStop.get('description') ? tap.currentStop.get('description')[0].value : undefined
			}));
			return this;
		}
	});
});
