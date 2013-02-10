// TapAPI Namespace Initialization //
if (typeof TapAPI === 'undefined'){TapAPI = {};}
if (typeof TapAPI.templates === 'undefined'){TapAPI.templates = {};}
// TapAPI Namespace Initialization //

TapAPI.templateManager = {

        get : function(templateName) {
                if (TapAPI.templates[templateName] === undefined) {
                        $.ajax({
                                async : false,
                                dataType : 'html',
                                url : 'js/backbone/templates/' + templateName + '.tpl.html',
                                success : function(data, textStatus, jqXHR) {
                                        TapAPI.templates[templateName] = _.template(data);
                                }
                        });
                }

                return TapAPI.templates[templateName];
        }

};