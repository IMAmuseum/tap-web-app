// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.views === 'undefined'){TapAPI.views = {};}
if (typeof TapAPI.views.registry === 'undefined'){TapAPI.views.registry = {};}
// TapAPI Namespace Initialization //

jQuery(function() {

	// Defines the base view for a page
	TapAPI.views.Page = Backbone.View.extend({

		template: TapAPI.templateManager.get('page'),
		page_title: '',
		back_label: 'Back',

		initialize: function(args) {
			this.page_title = args.page_title;
		},

		render: function(event) {

			this.$el.empty();
			$(this.el).html(this.template({
				title: this.page_title,
				back_label: this.back_label
			}));
			this.renderContent();
			return this;

		},

		// Sub-classes should override this function
		renderContent: function() {
			console.log('Warning: abstract TapApi.views.Page::renderContent');
		},

	});
	
});
