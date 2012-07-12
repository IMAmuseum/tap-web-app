// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //

jQuery(function() {

	// Defines the base view for a page
	TapAPI.views.Dialog = Backbone.View.extend({

		template: TapAPI.templateManager.get('dialog'),
		content: '',

		render: function(event) {

			this.$el.empty();
			$(this.el).html(this.template({
				content: this.content
			}));
			return this;

		}

	});
	
});
