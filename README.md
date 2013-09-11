TAP Web App
---

Tap Web is a web app implementation of the TAP tour experience. In essence, it is a single page application built 
in HTML5, using the Backbone javascript library, as well as jQuery (for templating, etc), that draws on a TourML 
bundle.

### Getting Started

To begin copy the example configuration file "dist/ExampleConfig.js" to "dist/Config.js".  Once you have completed
this step you will need to change at the minimal, the following line of code.

    tourMLEndpoint: '/node/1/tourml.xml',

Set the endpoint to your tour or tourset's tourml file.

Optionally you can change the settings to control which views are displayed on your application.  This section can
Also be used to add custom views to the web app. 

    tourSettings: {
        'tour-1': {
            'defaultNavigationController': 'StopListView',
            'enabledNavigationControllers': ['StopListView', 'MapView']
        }   
    },  

By default you can have any combination of the three following options

-KeypadView
-StopListView
-MapView

