var tourMLEndpoint = 'http://mw2014.imalab.us/author/node/15/tourml.xml';

//check for query parameters
var queryParameters = function() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}();

//if tourml query parameter exists override the config
if (queryParameters["tourml"] !== undefined) {
    tourMLEndpoint = queryParameters["tourml"];
}

//remove query parameters from url so backbone is good to go
var qPosition = window.location.href.indexOf('?');
if (qPosition > 0) {
    var url = window.location.href.slice(0, qPosition);
    // set the url
    window.history.replaceState(null, null, url);
    //window.location.hash = url;
}

var TapConfig = {
    //customize these variables for your install
    tourMLEndpoint: tourMLEndpoint,
    trackerID: '',
    geo: {},
    social: {},
    tourSettings: {
        'default': {
            'defaultNavigationController': 'StopListView',
            'enabledNavigationControllers': ['KeypadView', 'StopListView', 'MapView']
        }
    },
    navigationControllers: {},
    viewRegistry: {},
    primaryRouter: "Default",
    bundleHomeHeaderImageUri: "http://3.bp.blogspot.com/-631cCr0BZJ8/TdrKbLHvOqI/AAAAAAAAAWk/iXtjmFRdweM/s1600/mcnultyfinale.jpg"
};
