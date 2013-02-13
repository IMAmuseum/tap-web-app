define([
    'jquery',
    'underscore',
    'tap/views/AppView'
], function($, _, App) {
    var templateManager = {
        get : function(templateName) {
            if (App.templates[templateName] === undefined) {
                $.ajax({
                    async : false,
                    dataType : 'html',
                    url : 'templates/' + templateName + '.tpl.html',
                    success : function(data, textStatus, jqXHR) {
                        App.templates[templateName] = _.template(data);
                    }
                });
            }
            return App.templates[templateName];
        }
    };
    return templateManager;
});