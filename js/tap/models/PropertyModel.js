// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.models === 'undefined'){TapAPI.models = {};}
// TapAPI Namespace Initialization //

// define asset model
TapAPI.models.Property = Backbone.Model.extend({
	defaults: {
		'name': undefined,
		'value': undefined,
		'lang': undefined
	}
});
