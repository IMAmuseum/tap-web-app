TapAPI.classes.utility.TemplateManager = function() {
    this.templateUrls = ['templates/'];

    if (!_.isUndefined(TapConfig.templateUrls)) {
        this.templateUrls = _.uniq(TapConfig.templateUrls.concat(this.templateUrls));
    }

    this.get = function(templateName) {
        var that = this;
        return function(data) {
            return that.useTemplate(templateName, data);
        };
    };

    this.useTemplate = function(templateName, templateData) {
        if (TapAPI.templates[templateName] === undefined) {
            var found = false;
            var numUrls = this.templateUrls.length;
            for(var i=0; i < numUrls; i++) {
                $.ajax({
                    async : false,
                    dataType : 'html',
                    url : this.templateUrls[i] + templateName + '.tpl.html',
                    success : function(data, textStatus, jqXHR) {
                        TapAPI.templates[templateName] = _.template(data);
                        found = true;
                    }
                });
                if (found) break;
            }
        }
        return TapAPI.templates[templateName](templateData);
    };
};

TapAPI.templateManager = new TapAPI.classes.utility.TemplateManager();