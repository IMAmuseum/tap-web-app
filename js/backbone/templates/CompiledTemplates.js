// TapAPI Namespace Initialization //
if (typeof TapAPI === "undefined"){TapAPI = {};}
if (typeof TapAPI.templates === "undefined"){TapAPI.templates = {};}
// TapAPI Namespace Initialization //
TapAPI.templates['audio-stop'] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class=\'tour-stop audio\'>\n\t<div class=\'title\'>'+
((__t=( tour_stop_title ))==null?'':__t)+
'</div>\n\t<audio id="audio-player" controls="controls">\n\t\t<p>Your browser does not support the audio element.</p>\n\t</audio>\n\t<video id="video-player" autoplay controls="controls" style=\'display:none;\'\n\t';
 if (poster_image_path !== null) { 
__p+='\n\t\tposter=\''+
((__t=( poster_image_path ))==null?'':__t)+
'\'\n\t';
 } 
__p+='\n\t>\n\t\t<p>Your browser does not support the video element.</p>\n\t</video>\n\t';
 if (poster_image_path !== null) { 
__p+='\n\t\t<img class="poster-image" src="'+
((__t=( poster_image_path ))==null?'':__t)+
'" />\n\t';
 } 
__p+='\n\t';
 if (transcription !== null) { 
__p+='\n\t\t<div id=\'trans-button\' data-role=\'button\' class=\'ui-mini\'>Show Transcription</div>\n\t\t<div class=\'transcription hidden\'><p>'+
((__t=( transcription ))==null?'':__t)+
'</p></div>\n\t';
 } 
__p+='\n</div>';
}
return __p;
}
TapAPI.templates['dialog'] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div data-role="dialog" id="'+
((__t=( id ))==null?'':__t)+
'">\n\t<div data-role="header" data-theme="d">\n\t\t<h1></h1>\n\t</div>\n\t<div data-role="content" data-theme="c" align="center">\n\t\t'+
((__t=( content ))==null?'':__t)+
'\n\t</div>\n</div>';
}
return __p;
}
TapAPI.templates['image-stop-item'] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='\t<li>\n\t\t<a href="'+
((__t=( fullImageUri ))==null?'':__t)+
'" rel="external"><img src="'+
((__t=( thumbUri ))==null?'':__t)+
'" alt="'+
((__t=( title ))==null?'':__t)+
'" title="'+
((__t=( title ))==null?'':__t)+
'" /></a>\n\t</li>\n';
}
return __p;
}
TapAPI.templates['image-stop'] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<ul id="Gallery" class="ui-grid-b">\n</ul>\n';
}
return __p;
}
TapAPI.templates['keypad'] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<fieldset class="ui-grid-b" id="keypad" data-theme=\'d\'>\n\t<div class="ui-block-a" id="writeStyle">\n\t\t<div class="ui-bar" id="write"></div>\n\t</div>\n\t<div class="ui-block-b">\n\t\t<div class="ui-bar ui-bar-d" id="gobtn">Go</div>\t\n\t</div>\n\t<div class="ui-block-a"><div class="button ui-bar ui-bar-d">1</div></div>\n\t<div class="ui-block-b"><div class="button ui-bar ui-bar-d">2</div></div>\t \n\t<div class="ui-block-b"><div class="button ui-bar ui-bar-d">3</div></div>  \n\t<div class="ui-block-a"><div class="button ui-bar ui-bar-d">4</div></div>\n\t<div class="ui-block-b"><div class="button ui-bar ui-bar-d">5</div></div>\t \n\t<div class="ui-block-b"><div class="button ui-bar ui-bar-d">6</div></div>  \n\t<div class="ui-block-a"><div class="button ui-bar ui-bar-d">7</div></div>\n\t<div class="ui-block-b"><div class="button ui-bar ui-bar-d">8</div></div>\t \n\t<div class="ui-block-b"><div class="button ui-bar ui-bar-d">9</div></div>  \n\t<div class="ui-block-a"><div class="button ui-bar ui-bar-d">0</div></div>\n\t<div class="ui-block-b" id="clearStyle">\n\t\t<div class="ui-bar ui-bar-d" id="delete">Clear</div>\n\t</div>\n</fieldset>\n';
}
return __p;
}
TapAPI.templates['page'] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div data-role="header" data-id="tap-header" data-position="fixed">\n\t<a id=\'back-button\' data-rel="back" data-mini="true">'+
((__t=( back_label ))==null?'':__t)+
'</a>\n\t';
 if (header_nav) { 
__p+='\n\t<div id=\'index-selector\' data-role="controlgroup" data-type="horizontal" data-mini="true">\n\t\t';
 _.each(nav_menu, function(item) { 
__p+='\n\t\t<a data-role="button" '+
((__t=( (active_index == item.endpoint) ? 'data-theme="b"' : "" ))==null?'':__t)+
' href=\'#'+
((__t=( item.endpoint ))==null?'':__t)+
'/'+
((__t=( tour_id ))==null?'':__t)+
'\'>'+
((__t=( item.label ))==null?'':__t)+
'</a>\n\t\t';
 }); 
__p+='\n\t</div>\n\t';
 } else { 
__p+='\n\t<h1 id="page-title">'+
((__t=( title ))==null?'':__t)+
'</h1>\n\t';
 } 
__p+='\n</div>\n<div data-role="content">\n</div>\n';
 if (footer_nav) { 
__p+='\n<div data-role="footer" data-id="tap-footer" data-position="fixed">\n\t<div data-role="navbar">\n\t\t<ul>\n\t\t\t';
 _.each(nav_menu, function(item) { 
__p+='\n\t\t\t<li><a '+
((__t=( (active_index == item.endpoint) ? 'data-theme="b"' : "" ))==null?'':__t)+
' href=\'#'+
((__t=( item.endpoint ))==null?'':__t)+
'/'+
((__t=( tour_id ))==null?'':__t)+
'\'>'+
((__t=( item.label ))==null?'':__t)+
'</a></li>\n\t\t\t';
 }); 
__p+='\n\t\t</ul>\n\t</div>\n</div>\n';
 } 
__p+='';
}
return __p;
}
TapAPI.templates['stop-group-list-item'] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<a href="#tourstop/'+
((__t=( tourId ))==null?'':__t)+
'/'+
((__t=( id ))==null?'':__t)+
'">'+
((__t=( title ))==null?'':__t)+
'</a>\n';
}
return __p;
}
TapAPI.templates['stop-group'] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class=\'tour-stop stop-group\' style="width:100%;">\n\t<div class=\'title\'>'+
((__t=( tourStopTitle ))==null?'':__t)+
'</div>\n\t<div class=\'description\'>'+
((__t=( description ))==null?'':__t)+
'</div>\n\t<ul id="stop-list" class="ui-listview" data-inset="true" data-role="listview"></ul>\n</div>\n';
}
return __p;
}
TapAPI.templates['stop'] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class=\'stop\' style="width:100%;">\n\t<div class=\'title\'>'+
((__t=( tourStopTitle ))==null?'':__t)+
'</div>\n\t<div class=\'description\'>'+
((__t=( tourStopDescription ))==null?'':__t)+
'</div>\n</div>\n';
}
return __p;
}
TapAPI.templates['tour-details'] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="">\t\t\t\n\t<a href="#'+
((__t=( tour_index ))==null?'':__t)+
'/'+
((__t=( tour_id ))==null?'':__t)+
'" id="start-tour" data-role="button" data-theme="b">Start Tour</a>\n</div>\n<div class=\'tour-details\'>\n\t'+
((__t=( description ))==null?'':__t)+
'\n</div>\n';
}
return __p;
}
TapAPI.templates['tour-list-item'] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<a href="#tour/'+
((__t=( id ))==null?'':__t)+
'">'+
((__t=( title ))==null?'':__t)+
'</a>\n';
}
return __p;
}
TapAPI.templates['tour-list'] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<ul id="tour-list" class="ui-listview" data-inset="true" data-role="listview"></ul>';
}
return __p;
}
TapAPI.templates['tour-map-distance-label'] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class=\'distance-label-container\'>\n<div class=\'distance-label\'>'+
((__t=( distance ))==null?'':__t)+
'</div>\n</div>';
}
return __p;
}
TapAPI.templates['tour-map-marker-bubble'] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class=\'marker-bubble-content\'>\n\t<div class=\'title\'>'+
((__t=( title ))==null?'':__t)+
'</div>\n\t<div class=\'distance\'>'+
((__t=( distance ))==null?'':__t)+
'</div>\n\t<div class=\'view-button\'><a href=\'#tourstop/'+
((__t=( tour_id ))==null?'':__t)+
'/'+
((__t=( stop_id ))==null?'':__t)+
'\'>View stop</a></div>\n\t<div class=\'directions\'>\n\t\t<a href=\'http://maps.google.com/maps?saddr=Current%20Location&daddr='+
((__t=( stop_lat ))==null?'':__t)+
','+
((__t=( stop_lon ))==null?'':__t)+
'\'>Get Directions</a>\n\t</div>\n</div>';
}
return __p;
}
TapAPI.templates['tour-map'] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id=\'tour-map\'>Unable to display the map</div>';
}
return __p;
}
TapAPI.templates['tour-stop-list-item'] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<a href=\'#tourstop/'+
((__t=( tour_id ))==null?'':__t)+
'/'+
((__t=( stop_id ))==null?'':__t)+
'\'>'+
((__t=( title ))==null?'':__t)+
'\n';
 if (distance !== '') { 
__p+='\n<span class=\'distance\'>'+
((__t=( distance ))==null?'':__t)+
'</span>\n';
 } 
__p+='\n</a>';
}
return __p;
}
TapAPI.templates['tour-stop-list'] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<ul id="tour-stop-list" class="ui-listview" data-inset="true" data-role="listview"></ul>\n';
 if (enable_proximity_order) { 
__p+='\n<div data-role="fieldcontain" id=\'proximity-container\'>\n<label for="proximity-toggle">Distance ordering:</label>\n<select name="proximity-toggle" id="proximity-toggle" data-role="slider">\n\t<option value="off">Off</option>\n\t<option value="on">On</option>\n</select> \n</div>\n';
}
__p+='';
}
return __p;
}
TapAPI.templates['video-stop'] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class=\'tour-stop video\'>\n\t<div class=\'title\'>'+
((__t=( tourStopTitle ))==null?'':__t)+
'</div>\n\t<video id="video-player" controls="controls" autoplay="autoplay"\n\t';
 if (poster_image_path !== null) { 
__p+='\n\t\tposter=\''+
((__t=( poster_image_path ))==null?'':__t)+
'\'\n\t';
 } 
__p+='\n\t>\n\t\t<p>Your browser does not support the video tag.</p>\n\t</video>\n\t';
 if (transcription !== null) { 
__p+='\n\t\t<div id=\'trans-button\' data-role=\'button\' class=\'ui-mini\'>Show Transcription</div>\n\t\t<div class=\'transcription hidden\'><p>'+
((__t=( transcription ))==null?'':__t)+
'</p></div>\n\t';
 } 
__p+='\n</div>\n';
}
return __p;
}