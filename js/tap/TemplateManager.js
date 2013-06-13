TapAPI.templateManager = {
    get : function(templateName) {
        if (TapAPI.templates[templateName] === undefined) {
            $.ajax({
                async : false,
                dataType : 'html',
                url : 'templates/' + templateName + '.tpl.html',
                success : function(data, textStatus, jqXHR) {
                    TapAPI.templates[templateName] = _.template(data);
                }
            });
        }
        return TapAPI.templates[templateName];
    }
};