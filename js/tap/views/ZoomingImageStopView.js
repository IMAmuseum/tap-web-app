// /*
//  * Backbone View for displaying the Map navigation interface
//  * Relies on leaflet
//  */
// TapAPI.classes.views.ZoomingImageView = TapAPI.classes.views.StopSelectionView.extend({
//     id: 'tour-zooming',
//     initialize: function(options) {
//         var that = this;
//         this._super(options);

//         // this.title = '';
//         // temp = this.model;
//         // this.imageWidth = this.model.getAssets()[0].get('source').at(0).attributes.propertySet.models[0].attributes.value;
//         // this.imageHeight = this.model.getAssets()[0].get('source').at(0).attributes.propertySet.models[1].attributes.value;
//         // this.description = this.model.get('description');
//         // this.assetUri = this.model.getAssets()[0].get('source').at(0).get('uri');

//         $(':jqmData(role="page")').on('pageinit', {context: this}, this.resizeMapViewport);
//         $(window).on('orientationchange resize', {context: this}, this.resizeMapViewport);
//     },
//     render: function() {
//         return this;
//     },
//     finishedAddingContent: function() {
//         var url = this.model.getAssets()[0].get('source').at(0).get('uri');
//         var url = url + '/';
//         var imageWidth = this.model.getAssets()[0].get('source').at(0).attributes.propertySet.models[0].attributes.value;
//         var imageHeight = this.model.getAssets()[0].get('source').at(0).attributes.propertySet.models[1].attributes.value;
//         var attribution = this.model.get('description');

//         // create map
//         this.map = L.map('content-wrapper', {
//             maxZoom: 3,
//             minZoom: 0
//         }).setView(new L.LatLng(0,0), 0);

//         L.tileLayer.zoomify(url, {
//             width: imageHeight,
//             height: imageWidth,
//             tolerance: 0.8,
//             attribution: attribution.replace(/(<([^>]+)>)/ig,"")
//         }).addTo(this.map);
//         // this.map = L.map('tour-zooming', {attributionControl: false}).setView([0, 0], 0);

//         // this.tileLayer = L.tileLayer(this.assetUri + '/zoom{z}/row{y}/col{x}.png', {
//         //     continuousWorld: true,
//         //     nowrap: true,
//         //     reuseTiles: true
//         // }).addTo(this.map);
//         // // add description
//         // var desc = $('<div class="zoomingImageDescription"></div>')
//         //     .append('<div class="zoomingImageDescriptionHandle">Description</div>')
//         //     .append($('<div class="zoomingImageDescriptionText">'+this.description+'</div>').css({
//         //         // @TODO temporary, move this into css
//         //         'height': '100px',
//         //         'width': '100px',
//         //         'background-color': 'red',
//         //         'position': 'absolute',
//         //         'bottom': '0px',
//         //         'left': '0px',
//         //         'display': 'none'
//         //     }))
//         //     .appendTo(this.$el);
//         // $('.zoomingImageDescription, .zoomingImageDescriptionText').click(function(e) {
//         //     e.preventDefault(); // don't pass the event through
//         //     $('.zoomingImageDescriptionText').toggle();
//         // });
//     },
//     resizeMapViewport: function(e) {
//         var footer, header, viewport;

//         viewport = $('html').height();
//         header = $('[data-role="header"]').outerHeight();
//         footer = $('[data-role="footer"]').outerHeight();

//         //$('#content-wrapper').height(viewport - header - footer);
//         $('#content-wrapper').height(viewport - header - footer - (parseInt($('#content-wrapper').css('padding-top'), 10) * 2));

//         if (e.data.context.map !== null) {
//             e.data.context.map.invalidateSize();
//         }
//         window.scroll(0, 0);
//     },
//     onClose: function() {
//         // remove event handlers
//         $(':jqmData(role="page")').off('pageinit', this.resizeMapViewport);
//         $(window).off('orientationchange resize', this.resizeMapViewport);

//         $('#content-wrapper').removeAttr('style');
//     }
// });

/*
 * Backbone View for displaying the Map navigation interface
 * Relies on leaflet
 */
TapAPI.classes.views.ZoomingImageView = TapAPI.classes.views.StopSelectionView.extend({
    id: 'tour-zooming',
    initialize: function(options) {
        var that = this;
        this._super(options);

        this.title = '';
        temp = this.model;
        this.imageWidth = this.model.getAssets()[0].get('source').at(0).attributes.propertySet.models[0].attributes.value;
        this.imageHeight = this.model.getAssets()[0].get('source').at(0).attributes.propertySet.models[1].attributes.value;
        this.description = this.model.get('description');
        this.assetUri = this.model.getAssets()[0].get('source').at(0).get('uri');

        $(':jqmData(role="page")').on('pageinit', {context: this}, this.resizeMapViewport);
        $(window).on('orientationchange resize', {context: this}, this.resizeMapViewport);
    },
    render: function() {
        return this;
    },
    finishedAddingContent: function() {
        // create map
        var tolerance = 0.8;
        var url = this.model.getAssets()[0].get('source').at(0).get('uri');
        var url = url + '/';
        var imageWidth = this.model.getAssets()[0].get('source').at(0).attributes.propertySet.models[0].attributes.value;
        var imageHeight = this.model.getAssets()[0].get('source').at(0).attributes.propertySet.models[1].attributes.value;
        var attribution = this.model.get('description');

        // center = L.point(imageSize.x / 2, imageSize.y / 2)

        this.map = L.map('tour-zooming', {
            maxZoom: 3,
            continuousWorld: true,
            tolerance: tolerance,
            minZoom: 0,
            attribution: attribution
        }).setView([0, -50], 0);
        // setup tile layer
        console.log(this.assetUri + '/zoom{z}/row{y}/col{x}.png', 'url');
        this.tileLayer = L.tileLayer(this.assetUri + '/zoom{z}/row{y}/col{x}.png', {
            continuousWorld: true,
            nowrap: true,
            reuseTiles: true
        }).addTo(this.map);
        // add description
        // var desc = $('<div class="zoomingImageDescription"></div>')
        //     .append('<div class="zoomingImageDescriptionHandle">Description</div>')
        //     .append('<div class="zoomingImageDescriptionText">'+this.description+'</div>')
        //     .appendTo(this.$el);
        // desc.on('click', function(e) {
        //     console.log(e);
        // });
    },
    resizeMapViewport: function(e) {
        var footer, header, viewport;

        viewport = $('html').height();
        header = $('[data-role="header"]').outerHeight();
        footer = $('[data-role="footer"]').outerHeight();

        //$('#content-wrapper').height(viewport - header - footer - (parseInt($('#content-wrapper').css('padding-top'), 10) * 2));
        $('#content-wrapper').height(viewport - header - footer + 6);

        if (e.data.context.map !== null) {
            e.data.context.map.invalidateSize();
        }
        window.scroll(0, 0);
    },
    onClose: function() {
        // remove event handlers
        $(':jqmData(role="page")').off('pageinit', this.resizeMapViewport);
        $(window).off('orientationchange resize', this.resizeMapViewport);

        $('#content-wrapper').removeAttr('style');
    }
});