// var fakeData = require("/data/fakeData");
// 
// $.printDeviceBtn.addEventListener('click', function () {
    // var blah = $.device;
    // blah.fetch();
    // Ti.API.info("device: " + JSON.stringify(blah));
    // $.output.value = JSON.stringify(blah);
// });
// 
// $.closeBtn.addEventListener('click', function () {
    // $.win.close();
// });
// 
// function printFolderInViewTable () {
 	// var blah = Alloy.Collections.folderInView;
    // blah.fetch();
    // Ti.API.info("view: " + JSON.stringify(blah));
    // $.output.value = JSON.stringify(blah);		
// }
// 
// function printDeviceInFolderTable () {
 	// var blah = Alloy.Collections.deviceInFolder;
    // blah.fetch();
    // Ti.API.info("view: " + JSON.stringify(blah));
    // $.output.value = JSON.stringify(blah);		
// }
// 
// function createFakeData () {
	// fakeData.createFakeData();
// }
// 
// function deleteFakeData () {
	// fakeData.deleteFakeData();
// }
// 
// function createFakeDevices () {
	// fakeData.createFakeDevices();
// }
// 
// function createFakeFolders () {
	// fakeData.createFakeFolders();
// }


// $.btn.onClick(function (e) {
	// Ti.API.info("onClick btn1 E: " + JSON.stringify(e));
// });
// 
// $.btn.onTouchEnd(function (e) {
	// Ti.API.info("touchend E: " + JSON.stringify(e));
// });
// 
// $.win.addEventListener("open", function() {
    // $.btn.setBtnValue(10);
// });

Ti.API.info("Debug window opened!");
var websocket = require('net.iamyellow.tiws').createWS();

websocket.addEventListener('open', function () {
	Ti.API.info('websocket opened');
	websocket.send("blah");
});

websocket.addEventListener('close', function (ev) {
	Ti.API.info('websocket closed');
});

websocket.addEventListener('error', function (ev) {
	// ev.error contains error description, if any
	Ti.API.info(ev.error);
});
 
websocket.addEventListener('message', function (ev) {
	// ev.data contains message data
	Ti.API.log(ev.data);
});

websocket.open('ws://localhost:8001');