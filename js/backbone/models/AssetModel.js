// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.models === 'undefined'){TapAPI.models = {};}
// TapAPI Namespace Initialization //

// define asset model
TapAPI.models.Asset = Backbone.Model.extend({
	parse: function(response) {
		response.propertySet = new TapAPI.collections.PropertySet(
			response.propertySet,
			response.id
		);

		if (response.source) {
			response.source = new TapAPI.collections.Sources(
				response.source,
				response.id
			);
		}

		if (response.content) {
			response.content = new TapAPI.collections.Content(
				response.content,
				response.id
			);
		}

		return response;
	}
});
