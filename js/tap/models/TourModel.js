/*
 * Backbone Model for storing a Tour
 */
TapAPI.classes.models.TourModel = Backbone.Model.extend({
    get: function(attr) { // override get method
        if(!this.attributes[attr]) return this.attributes[attr];
        switch(attr) {  // retrieve attribute based on language
            case 'description':
            case 'title':
                if (this.attributes[attr].length === 0) return undefined;

                var value, property;

                property = _.find(this.attributes[attr], function(item) {
                    return item.lang === TapAPI.language;
                });

                if (!property && TapAPI.language !== TapAPI.defaultLanguage) {
                    property = _.find(this.attributes[attr], function(item) {
                        return item.lang === TapAPI.defaultLanguage;
                    });
                }

                if (!property) {
                    property = _.find(this.attributes[attr], function(item) {
                        return item.lang === undefined || item.lang === "";
                    });
                }

                if (property) {
                    value = property.value;
                }

                return value;
            default:
                return this.attributes[attr];
        }
    },
    parse: function(response) {
        response.propertySet = new TapAPI.classes.collections.PropertySetCollection(
            response.propertySet,
            {id: response.id}
        );

        return response;
    },
    getAppResourceByUsage: function(usage) {
        var appResource;

        _.each(this.get('appResource'), function(resource) {
            if (!_.isUndefined(resource) && resource.usage === usage) {
                var asset = TapAPI.tourAssets.get(resource.id);
                var source = asset.get('source');
                if (!_.isUndefined(source)) {
                    appResource = source.at(0).get('uri');
                }
            }
        });

        return appResource;
    },
    getAppResourceModelByUsage: function(usage) {
        var appResources = [];

        _.each(this.get('appResource'), function(resource) {
            if (!_.isUndefined(resource) && resource.usage === usage) {
                var asset = TapAPI.tourAssets.get(resource.id);
                appResources.push(asset);
            }
        });

        return appResources;
    }
});