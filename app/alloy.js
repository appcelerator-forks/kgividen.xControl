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

var VIEW_ID_FAVORITES = 0;
var VIEW_ID_LIGHTS = 1;
var VIEW_ID_SCENES = 2;

Alloy.Collections.device = Alloy.createCollection("Device");
Alloy.Collections.folderInView = Alloy.createCollection("FolderInView");
Alloy.Collections.deviceInFolder = Alloy.createCollection("DeviceInFolder");
Alloy.Collections.programs = Alloy.createCollection("Program");

var osname = "android";
if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
    osname = "ios";
}

var device = require('isy');
device.init();

var Q = require('/q');


// Helpers
var xDebug = false;

var tiInfo = function(label, input){
	if(xDebug == true){
		Ti.API.info(label + ": " + JSON.stringify(input));		
	}
};
