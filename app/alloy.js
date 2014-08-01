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
var VIEW_ID_FAVORITES = 1;
var VIEW_ID_LIGHTS = 2;
var VIEW_ID_SCENES = 3;

Alloy.Collections.device = Alloy.createCollection("Device");
Alloy.Collections.deviceInView = Alloy.createCollection("DeviceInView");
Alloy.Collections.view = Alloy.createCollection("View");

var osname = "android";
if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
    osname = "ios";
}

var device = require('isy');
device.init();

var Q = require('/q');