define(["tap/TapAPI"], function (TapAPI) {TapAPI.templates['audio'] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h3 class="stop-title">' +
((__t = ( title )) == null ? '' : __t) +
'</h3>\n<audio id="audio-player" class="player" controls="controls">\n\t<p>Your browser does not support HTML 5 audio.</p>\n\t';
 _.each(sources, function(source) { ;
__p += '\n\t' +
((__t = ( source )) == null ? '' : __t) +
'\n\t';
 }); ;
__p += '\n</audio>\n';
 if (!_.isEmpty(imagePath)) { ;
__p += '\n\t<img class="poster-image" src="' +
((__t = ( imagePath )) == null ? '' : __t) +
'" />\n';
 } ;
__p += '\n';
 if (!_.isEmpty(description)) { ;
__p += '\n<div class="description" data-role="collapsible" data-content-theme="c">\n\t<h3>Description</h3>\n\t' +
((__t = ( description )) == null ? '' : __t) +
'\n</div>\n';
 } ;
__p += '\n';
 if (!_.isEmpty(transcription)) { ;
__p += '\n<div id="transcription" data-role="collapsible" data-content-theme="c">\n\t<h3>Transcript</h3>\n\t<p>' +
((__t = ( transcription )) == null ? '' : __t) +
'</p>\n</div>\n';
 } ;


}
return __p
};

TapAPI.templates['footer'] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div data-role="navbar" data-iconpos="top">\n\t<ul>\n        ';
 for(var view in controllers) { ;
__p += '\n\t\t<li>\n            <a href="#tour/' +
((__t = ( tourID )) == null ? '' : __t) +
'/controller/' +
((__t = ( view )) == null ? '' : __t) +
'"\n            data-icon="' +
((__t = ( view.toLowerCase() )) == null ? '' : __t) +
'"\n            data-iconshadow="true"\n            class="' +
((__t = ( view === activeToolbarButton ? 'ui-btn-active' : '' )) == null ? '' : __t) +
'">' +
((__t = ( controllers[view].label )) == null ? '' : __t) +
'</a>\n        </li>\n        ';
 }; ;
__p += '\n\t</ul>\n</div>';

}
return __p
};

TapAPI.templates['header'] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (displayBackButton) { ;
__p += '\n<a href="#" id="back-button" data-role="back" data-icon="arrow-l">Back</a>\n';
 } ;
__p += '\n<h3>' +
((__t = ( title )) == null ? '' : __t) +
'</h3>\n';
 if (displaySocialButton) { ;
__p += '\n<a href="#" id="social-button" data-role="button" data-icon="social" \ndata-iconpos="notext" data-iconshadow="false" class="ui-icon-nodisc ui-btn-right">Social</a>\n';
 } ;


}
return __p
};

TapAPI.templates['image-stop'] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h3 class="stop-title">' +
((__t = ( title )) == null ? '' : __t) +
'</h3>\n';
 _.each(images, function(image) { ;
__p += '\n\t<li>\n\t\t<a href="' +
((__t = ( image.originalUri )) == null ? '' : __t) +
'" rel="external">\n\t\t\t<img src="' +
((__t = ( image.thumbnailUri )) == null ? '' : __t) +
'" alt="' +
((__t = ( image.caption )) == null ? '' : __t) +
'" title="' +
((__t = ( image.title )) == null ? '' : __t) +
'" />\n\t\t</a>\n\t</li>\n';
 }) ;


}
return __p
};

TapAPI.templates['keypad'] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __d = obj.obj || obj;
__p += '<fieldset class="ui-grid-b">\n    <div id="code-label-wrapper" class="ui-block-a ui-block-b ui-block-c">\n        <div id="code-label-border">\n            <div id="code-label"></div>\n        </div>\n    </div>\n    <div class="ui-block-a">\n        <div data-role="button" data-theme="a" class="keypad-button">1</div>\n    </div>\n    <div class="ui-block-b">\n        <div data-role="button" data-theme="a" class="keypad-button">2</div>\n    </div>\n    <div class="ui-block-c">\n        <div data-role="button" data-theme="a" class="keypad-button">3</div>\n    </div>\n    <div class="ui-block-a">\n        <div data-role="button" data-theme="a" class="keypad-button">4</div>\n    </div>\n    <div class="ui-block-b">\n        <div data-role="button" data-theme="a" class="keypad-button">5</div>\n    </div>\n    <div class="ui-block-c">\n        <div data-role="button" data-theme="a" class="keypad-button">6</div>\n    </div>\n    <div class="ui-block-a">\n        <div data-role="button" data-theme="a" class="keypad-button">7</div>\n    </div>\n    <div class="ui-block-b">\n        <div data-role="button" data-theme="a" class="keypad-button">8</div>\n    </div>\n    <div class="ui-block-c">\n        <div data-role="button" data-theme="a" class="keypad-button">9</div>\n    </div>\n    <div class="ui-block-a" id="clear-button-wrapper">\n        <div id="clear-button" data-role="button" data-theme="b" class="action-button">Clear</div>\n    </div>\n    <div class="ui-block-b">\n        <div data-role="button" data-theme="a" class="keypad-button">0</div>\n    </div>\n    <div class="ui-block-c">\n        <div id="go-button" data-role="button" data-theme="b" class="action-button ui-disabled">Go</div>\n    </div>\n</fieldset>\n';
return __p
};

TapAPI.templates['map-distance-label'] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __d = obj.obj || obj;
__p += '<div class="distance-label-container">\n    <div class="distance-label">' +
((__t = ( obj.distance )) == null ? '' : __t) +
'</div>\n</div>';
return __p
};

TapAPI.templates['map-marker-bubble'] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="marker-bubble-content">\n\t<div class="title">' +
((__t = ( title )) == null ? '' : __t) +
'</div>\n\t<div class="distance">' +
((__t = ( distance )) == null ? '' : __t) +
'</div>\n\t<div class="stop-options">\n        <a href="#tour/' +
((__t = ( tourID )) == null ? '' : __t) +
'/stop/' +
((__t = ( stopID )) == null ? '' : __t) +
'" class="ui-btn ui-shadow ui-btn-corner-all ui-mini ui-btn-inline ui-btn-up-c">\n            <span class="ui-btn-inner">\n                <span class="ui-btn-text">View Stop</span>\n            </span>\n        </a>\n        ';
 if (showDirections) { ;
__p += '\n        <a href="http://maps.google.com/maps?saddr=Current%20Location&daddr=' +
((__t = ( stopLat )) == null ? '' : __t) +
',' +
((__t = ( stopLong )) == null ? '' : __t) +
'"\n            class="ui-btn ui-shadow ui-btn-corner-all ui-mini ui-btn-inline ui-btn-up-c">\n            <span class="ui-btn-inner">\n                <span class="ui-btn-text">Directions</span>\n            </span>\n        </a>\n        ';
 } ;
__p += '\n\t</div>\n</div>';

}
return __p
};

TapAPI.templates['page'] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div data-role="header" data-id="tap-header" data-position="fixed">\n\t<a id=\'back-button\' data-rel="back" data-mini="true">' +
((__t = ( back_label )) == null ? '' : __t) +
'</a>\n\t';
 if (header_nav) { ;
__p += '\n\t<div id=\'index-selector\' data-role="controlgroup" data-type="horizontal" data-mini="true">\n\t\t';
 _.each(nav_menu, function(item) { ;
__p += '\n\t\t<a data-role="button" ' +
((__t = ( (active_index == item.endpoint) ? 'data-theme="b"' : "" )) == null ? '' : __t) +
' href=\'#' +
((__t = ( item.endpoint )) == null ? '' : __t) +
'/' +
((__t = ( tour_id )) == null ? '' : __t) +
'\'>' +
((__t = ( item.label )) == null ? '' : __t) +
'</a>\n\t\t';
 }); ;
__p += '\n\t</div>\n\t';
 } else { ;
__p += '\n\t<h1 id="page-title">' +
((__t = ( title )) == null ? '' : __t) +
'</h1>\n\t';
 } ;
__p += '\n</div>\n<div data-role="content">\n</div>\n';
 if (footer_nav) { ;
__p += '\n<div data-role="footer" data-id="tap-footer" data-position="fixed">\n\t<div data-role="navbar">\n\t\t<ul>\n\t\t\t';
 _.each(nav_menu, function(item) { ;
__p += '\n\t\t\t<li><a ' +
((__t = ( (active_index == item.endpoint) ? 'data-theme="b"' : "" )) == null ? '' : __t) +
' href=\'#' +
((__t = ( item.endpoint )) == null ? '' : __t) +
'/' +
((__t = ( tour_id )) == null ? '' : __t) +
'\'>' +
((__t = ( item.label )) == null ? '' : __t) +
'</a></li>\n\t\t\t';
 }); ;
__p += '\n\t\t</ul>\n\t</div>\n</div>\n';
 } ;


}
return __p
};

TapAPI.templates['popup'] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (!_.isEmpty(title)) { ;
__p += '\n<div data-role="header" data-theme="a" role="banner">\n\t<h1 role="heading">' +
((__t = ( title )) == null ? '' : __t) +
'</h1>\n</div>\n';
 } ;
__p += '\n<div data-role="content" data-theme="d" role="main">\n\t<p>' +
((__t = ( message )) == null ? '' : __t) +
'</p>\n\t<a href="#" id="dialog-cancel" data-role="button" data-theme="c"\n\t\tdata-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span">' +
((__t = ( cancelButtonTitle )) == null ? '' : __t) +
'</a>\n</div>';

}
return __p
};

TapAPI.templates['social-popup'] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __d = obj.obj || obj;
__p += '<a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>\n<div data-role="header" data-theme="a" class="ui-corner-top">\n    <h1>Share TAP</h1>\n</div>\n<div data-role="content" data-theme="d" role="main">\n    <div id="twitter-share-button" class="share-button">\n        <iframe allowtransparency="true" frameborder="0" scrolling="no"\n                src="http://platform.twitter.com/widgets/tweet_button.html?url=' +
((__t = ( obj.url )) == null ? '' : __t) +
'"\n                style="width:100px; height:20px;"></iframe>\n    </div>\n    <div id="facebook-share-button" class="share-button">\n        <iframe src="http://www.facebook.com/plugins/like.php?href=' +
((__t = ( obj.url )) == null ? '' : __t) +
'&amp;send=false&amp;layout=button_count&amp;width=100&amp;show_faces=false&amp;font=arial&amp;colorscheme=light&amp;action=like&amp;height=21&amp;appId=' +
((__t = ( obj.FBAppID )) == null ? '' : __t) +
'" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:100px; height:21px;" allowTransparency="true"></iframe>\n    </div>\n</div>\n';
return __p
};

TapAPI.templates['stop-group'] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (!_.isUndefined(header)) { ;
__p += '\n<div id="header-wrapper">\n    <img src="' +
((__t = ( header )) == null ? '' : __t) +
'" />\n</div>\n';
 } ;
__p += '\n<h3 class="stop-title">' +
((__t = ( title )) == null ? '' : __t) +
'</h3>\n<div class=\'description\'>' +
((__t = ( description )) == null ? '' : __t) +
'</div>\n<ul id="stop-list" data-role="listview" data-inset="true">\n';
 _.each(stops, function(stop) { ;
__p += '\n    <li>\n        <a href="#tour/' +
((__t = ( tourID )) == null ? '' : __t) +
'/stop/' +
((__t = ( stop.id )) == null ? '' : __t) +
'">\n            <img src="' +
((__t = ( stop.icon )) == null ? '' : __t) +
'" class="ui-li-icon ui-li-thumb" />\n            ' +
((__t = ( stop.title )) == null ? '' : __t) +
'\n        </a>\n    </li>\n';
 }); ;
__p += '\n</ul>';

}
return __p
};

TapAPI.templates['stop-list'] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<ul  data-role="listview" data-filter="true">\n    ';
 _.each(stops, function(stop) { ;
__p += '\n    <li>\n        <a href=\'#tour/' +
((__t = ( tourID )) == null ? '' : __t) +
'/stop/' +
((__t = ( stop.get('id') )) == null ? '' : __t) +
'\'>\n            ';
 if (displayCodes && stop.getProperty('code')) { ;
__p += '\n            <span class="stop-code">' +
((__t = ( stop.getProperty('code') )) == null ? '' : __t) +
'</span>\n            <span class="title-with-code">\n            ';
 } else { ;
__p += '\n            <img src="' +
((__t = ( stop.get('icon') )) == null ? '' : __t) +
'" class="ui-li-icon ui-li-thumb" />\n            <span>\n            ';
 } ;
__p += '\n                ' +
((__t = ( stop.get('title') )) == null ? '' : __t) +
'\n            </span>\n        </a>\n    </li>\n    ';
 }); ;
__p += '\n</ul>';

}
return __p
};

TapAPI.templates['tour-details'] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (!_.isUndefined(header)) { ;
__p += '\n<div id="header-wrapper">\n    <img src="' +
((__t = ( header )) == null ? '' : __t) +
'" />\n</div>\n';
 } ;
__p += '\n<h3 class="tour-title">' +
((__t = ( title )) == null ? '' : __t) +
'</h3>\n<p>' +
((__t = ( description )) == null ? '' : __t) +
'</p>\n<a href="' +
((__t = ( defaultStopSelectionView )) == null ? '' : __t) +
'" id="start-tour" data-role="button" data-theme="b">Start Tour</a>';

}
return __p
};

TapAPI.templates['tour-list'] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<ul id="tour-list" class="ui-listview" data-split-icon="info" data-split-theme="d" data-role="listview">\n\t';
 _.each(tours, function(tour, i) { ;
__p += '\n\t<li data-icon="false">\n\t\t<a href="#" data-tour-id="' +
((__t = ( tour.get('id') )) == null ? '' : __t) +
'" class="tour-info">\n\t\t\t<div class="tour-wrapper">\n\t\t\t\t';
 if (headers[i] !== undefined) { ;
__p += '\n\t\t\t\t<div class="tour-image"><img src="' +
((__t = ( headers[i] )) == null ? '' : __t) +
'" /></div>\n\t\t\t\t';
 } ;
__p += '\n\t\t\t\t<div class="tour-title"><span>' +
((__t = ( tour.get('title') )) == null ? '' : __t) +
'</span></div>\n\t\t\t</div>\n\t\t</a>\n\t</li>\n\t';
 }); ;
__p += '\n</ul>';

}
return __p
};

TapAPI.templates['video'] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h3 class="stop-title">' +
((__t = ( title )) == null ? '' : __t) +
'</h3>\n<video id="video-player" class="player" controls="controls" autoplay="autoplay" poster="' +
((__t = ( imagePath )) == null ? '' : __t) +
'">\n\t<p>Your browser does not support the HTML5 video</p>\n\t';
 _.each(sources, function(source) { ;
__p += '\n\t' +
((__t = ( source )) == null ? '' : __t) +
'\n\t';
 }); ;
__p += '\n</video>\n';
 if (!_.isEmpty(transcription)) { ;
__p += '\n<div id="transcription" data-role="collapsible" data-content-theme="c">\n\t<h3>Transcript</h3>\n\t<p>' +
((__t = ( transcription )) == null ? '' : __t) +
'</p>\n';
 } ;


}
return __p
};

TapAPI.templates['web'] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __d = obj.obj || obj;
__p += '<h3 class="stop-title">' +
((__t = ( obj.title )) == null ? '' : __t) +
'</h3>\n<div id="html-container">' +
((__t = ( obj.html )) == null ? '' : __t) +
'</div>';
return __p
}});