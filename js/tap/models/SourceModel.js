define([
	'underscore',
	'backbone',
	'tap/collections/PropertySetCollection'
], function(_, Backbone, PropertySetCollectionn) {
	var sourceModel = Backbone.Model.extend({
		initialize: function() {
			//parse never gets called due to this not being in localstorage as its own record
			this.set('propertySet', new PropertySetCollection(
				this.get('propertySet'),
				{id: this.id}
			));
		},
		getAsset: function() {
			return this.collection.asset;
		},
		save: function() {
			this.collection.asset.save();
		},
		defaults: {
			'lang': undefined,
			'propertySet': undefined,
			'uri': undefined,
			'format': undefined,
			'lastModified': undefined,
			'part': undefined
		}
	});
	return sourceModel;
});