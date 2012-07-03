// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.models === 'undefined'){TapAPI.models = {};}
// TapAPI Namespace Initialization //

// define stop model
TapAPI.models.Stop = Backbone.Model.extend({
	get: function(attr) { // override get method
		if(!this.attributes[attr]) return this.attributes[attr];
		switch(attr) {  // retrieve attribute based on language
			case 'tourMetadata':
			case 'propertySet':
			case 'description':
			case 'title':
				return getAttributeByLanguage(this.attributes[attr]);
			default:
				return this.attributes[attr];
		}
	},
	/**
	* Retrieves the property value of a given property name
	* @param  string name The propety name
	* @return string The property value
	*/
	getPropertyByName: function(name) {
		if(_.isUndefined(this.get('propertySet'))) return false;
		var property = _.find(this.get('propertySet'), function(item) {
			return item['name'] === name;
		});
		return _.isUndefined(property) ? false : property.value;
	},
	/**
	* Retrieves all asset models for a stop
	* @return array An array of asset models
	*/
	getAssets: function() {
		if(_.isUndefined(this.get('assetRef'))) return false;
		var assets = [];
		_.each(this.get('assetRef'), function(item) {
			assets.push(tap.tourAssets.get(item.id));
		});
		return _.isEmpty(assets) ? false : assets;
	},
	/**
	* Retrieves an asset with a given usage
	* @param string usage The asset usage
	* @return mixed The asset model
	*/
	getAssetsByUsage: function(usage) {
		if(_.isUndefined(this.get('assetRef'))) return false;
		var assets = [];
		_.each(this.get('assetRef'), function(item) {
			if(item['usage'] === usage) {
				assets.push(tap.tourAssets.get(item.id));
			}
		});
		return _.isEmpty(assets) ? false : assets;
	},
	/**
	* Retrieves a sorted array of connections
	* @return array The connection array ordered by priority in ascending order
	*/
	getSortedConnections: function() {
		if(_.isUndefined(this.get('connections'))) return false;
		return _.sortBy(this.get('connection'), function(connection) {
			return parseInt(connection.priority, 10);
		});
	}
});
