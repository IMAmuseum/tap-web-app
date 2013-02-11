define([
    'jquery',
    'underscore',
    'backbone',
    'tap/app'
], function($, _, Backbone, App) {
	var baseView = Backbone.View.extend({
		initialize: function(args) {
			// TODO: check for an index menu setting in the current tour

			// Check for a default app index menu setting
			var navbar_items = null;
			if (App.tap.config.navbar_items !== undefined) {
				navbar_items = App.tap.config.navbar_items;
			} else {
				navbar_items = [
					{ label: 'Menu', endpoint: 'tourstoplist' },
					{ label: 'Keypad', endpoint: 'tourkeypad' },
					{ label: 'Map', endpoint: 'tourmap'}
				];
			}

			var header_nav_default = true;
			var footer_nav_default = false;
			if (App.tap.config.navbar_location !== undefined) {
				if (App.tap.config.navbar_location == 'footer') {
					header_nav_default = false;
					footer_nav_default = true;
				}
			}

			_.defaults(this.options, {
				page_title: '',
				back_label: 'Back',
				nav_menu: navbar_items,
				active_index: null,
				header_nav: header_nav_default,
				footer_nav: footer_nav_default
			});

			if (this.onInit) {
				this.onInit();
			}
		},
		close: function() {
			this.$el.empty().undelegate();
			this.off();
			this.undelegateEvents();
			if (this.onClose){
				this.onClose();
			}
		},
		render: function(event) {

			this.$el.empty();
			this.$el.html(TapAPI.templateManager.get('page')({
				title: this.options.page_title,
				back_label: this.options.back_label,
				header_nav: this.options.header_nav,
				footer_nav: this.options.footer_nav,
				nav_menu: this.options.nav_menu,
				active_index: this.options.active_index,
				tour_id: tap.currentTour
			}));
			this.renderContent();

			// Set width on the index selector control group so that it can center
			$(document).on('pageshow', function() {
				var w = 0;
				$items = $('#index-selector a').each(function() {
					w += $(this).outerWidth();
				});
				$('#index-selector .ui-controlgroup-controls').width(w);
			});

			return this;

		},
		// Sub-classes should override this function
		renderContent: function() {
			console.log('Warning: abstract TapApi.views.Page::renderContent');
		}
	});
	return baseView;
});