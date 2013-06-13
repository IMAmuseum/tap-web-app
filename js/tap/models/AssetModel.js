/*
 * Backbone Model for storing a TourML Asset
 */
TapAPI.classes.models.AssetModel = Backbone.Model.extend({
    parse: function(response) {
        response.propertySet = new TapAPI.classes.collections.PropertySetCollection(
            response.propertySet,
            {id: response.id}
        );

        if (response.source) {
            response.source = new TapAPI.classes.collections.SourceCollection(
                response.source,
                {
                    id: response.id,
                    asset: this
                }
            );
        }

        if (response.content) {
            response.content = new TapAPI.classes.collections.ContentCollection(
                response.content,
                {
                    id: response.id,
                    asset: this
                }
            );
        }

        return response;
    },
    getSourcesByPart: function(part) {
        if (_.isUndefined(this.get('source'))) return undefined;

        var sources, models;
        sources = this.get('source').where({"part": part, "lang": TapAPI.language});
        if (sources.length === 0) {
            sources = this.get('source').where({"part": part});
        }
        if (sources.length) {
            models = sources;
        }
        return models;
    },
    getContentsByPart: function(part) {
        if (_.isUndefined(this.get('content'))) return undefined;

        var contents, models;
        contents = this.get('content').where({"part": part, "lang": TapAPI.language});
        if (contents.length === 0) {
            contents = this.get('content').where({"part": part});
        }
        if (contents.length) {
            models = contents;
        }
        return models;
    },
    getSourcesByFormat: function(format) {
        if (_.isUndefined(this.get('source'))) return undefined;

        var sources, models;
        sources = this.get('source').where({"format": format, "lang": TapAPI.language});
        if (sources.length === 0) {
            sources = this.get('source').where({"format": format});
        }
        if (sources.length) {
            models = sources;
        }
        return models;
    },
    getContentsByFormat: function(format) {
        if (_.isUndefined(this.get('content'))) return undefined;

        var contents, models;
        contents = this.get('content').where({"format": format, "lang": TapAPI.language});
        if (contents.length === 0) {
            contents = this.get('content').where({"format": format});
        }
        if (contents.length) {
            models = contents;
        }
        return models;
    }
});