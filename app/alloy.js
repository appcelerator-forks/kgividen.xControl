// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
Alloy.Globals.PW = require('progressWindow');

Alloy.Globals.defaultTheme = true;
Alloy.Globals.blueTheme = false;

var VIEW_ID_FAVORITES = 0;
var VIEW_ID_LIGHTS = 1;
var VIEW_ID_SCENES = 2;
var VIEW_ID_SENSORS = 3;

Alloy.Collections.device = Alloy.createCollection("Device");

//DeviceByName for addDevice.xml 
Alloy.Collections.deviceByName = Alloy.createCollection("Device");
Alloy.Collections.deviceByName.comparator = function(d) {
	return d.get("displayName");	
};


Alloy.Collections.folder = Alloy.createCollection("Device"); //This is used on the settingsMenu
Alloy.Collections.folderInView = Alloy.createCollection("FolderInView");
Alloy.Collections.deviceInFolder = Alloy.createCollection("DeviceInFolder");
Alloy.Collections.programs = Alloy.createCollection("Program");
Alloy.Collections.isyStatus = Alloy.createCollection("IsyStatus");

//This is a temporary collection used for the listviews
// since we need all of the devices but then later through REST 
//want to update the status of those devices.
var collection = Backbone.Collection.extend({});
Alloy.Collections.devicesAndStatus = new collection();

var osname = "android";
if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
    osname = "ios";
}

var device = require('isy');

// Helpers
var xDebug = false;