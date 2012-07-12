// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //

jQuery(function() {

	// Defines the default stop view
	TapAPI.views.Stop = TapAPI.views.Page.extend({
		renderContent: function() {
			var content_template = TapAPI.templateManager.get('stop');

			$(":jqmData(role='content')", this.$el).append(content_template({
				tourStopTitle : this.model.get("title") ? this.model.get("title")[0].value : undefined,
				tourStopDescription : this.model.get('description') ? this.model.get('description')[0].value : undefined
			}));
			return this;

		}
	});
});
