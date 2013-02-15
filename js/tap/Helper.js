define([], function() {
    var helper = {
        replaceArray: function(obj, find, replace) {
            for (var i = 0; i < find.length; i++) {
                obj = obj.replace(find[i], replace);
            }
            return obj;
        },
        toCamel: function(str) {
            return str.replace(/\s(.)/g, function($1) {
                    return $1.toUpperCase();
                })
                .replace(/\s/g, '')
                .replace(/^(.)/, function($1) {
                    return $1.toLowerCase();
                });
        },
        /*
         * Load xml document
         */
        loadXMLDoc: function(url) {
            xhttp = new XMLHttpRequest();
            xhttp.open('GET', url, false);
            xhttp.send();
            return xhttp.responseXML;
        },
        /*
         * Attempt to make the variable an array
         */
        objectToArray: function(obj) {
            if(obj === undefined) return;
            return Object.prototype.toString.call(obj) !== '[object Array]' ? [obj] : obj;
        },
        /*
         * Convert xml to JSON
         */
        xmlToJson: function(xml, namespace) {
            var obj = true,
                i = 0;
            // retrieve namespaces
            if(!namespace) {
                namespace = ['xml:'];
                for(i = 0; i < xml.documentElement.attributes.length; i++) {
                    if(xml.documentElement.attributes.item(i).nodeName.indexOf('xmlns') != -1) {
                        namespace.push(xml.documentElement.attributes.item(i).nodeName.replace('xmlns:', '') + ':');
                    }
                }
            }

            var result = true;
            if (xml.attributes && xml.attributes.length > 0) {
                var attribute, str;
                result = {};
                for (var attributeID = 0; attributeID < xml.attributes.length; attributeID++) {
                    attribute = xml.attributes.item(attributeID);
                    str = this.replaceArray(attribute.nodeName, namespace, '');
                    str = this.toCamel(str);
                    result[str] = attribute.nodeValue;
                }
            }
            if (xml.hasChildNodes()) {
                var key, value, xmlChild;
                if (result === true) { result = {}; }
                for (var child = 0; child < xml.childNodes.length; child++) {
                    xmlChild = xml.childNodes.item(child);
                    if ((xmlChild.nodeType & 7) === 1) {
                        key = this.replaceArray(xmlChild.nodeName, namespace, '');

                        key = this.toCamel(key);
                        value = this.xmlToJson(xmlChild, namespace);
                        if (result.hasOwnProperty(key)) {
                            if (result[key].constructor !== Array) { result[key] = [result[key]]; }
                            result[key].push(value);
                        } else { result[key] = value; }
                    } else if ((xmlChild.nodeType - 1 | 1) === 3) {
                        key = 'value';
                        value = xmlChild.nodeType === 3 ? xmlChild.nodeValue.replace(/^\s+|\s+$/g, '') : xmlChild.nodeValue;
                        if (result.hasOwnProperty(key)) { result[key] += value; }
                        else if (xmlChild.nodeType === 4 || value !== '') { result[key] = value; }
                    }
                }
            }
            return(result);
        }
    };
    return helper;
});