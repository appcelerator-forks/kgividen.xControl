var fakeData = require("/data/fakeData");

$.printDeviceBtn.addEventListener('click', function () {
    var blah = $.device;
    blah.fetch();
    Ti.API.info("device: " + JSON.stringify(blah));
    $.output.value = JSON.stringify(blah);
});

$.closeBtn.addEventListener('click', function () {
    Alloy.createController("index").getView().open();
    $.win.close();
});

function printFolderInViewTable () {
 	var blah = Alloy.Collections.folderInView;
    blah.fetch();
    Ti.API.info("view: " + JSON.stringify(blah));
    $.output.value = JSON.stringify(blah);		
}

function printDeviceInFolderTable () {
 	var blah = Alloy.Collections.deviceInFolder;
    blah.fetch();
    Ti.API.info("view: " + JSON.stringify(blah));
    $.output.value = JSON.stringify(blah);		
}

function createFakeData () {
	fakeData.createFakeData();
}

function deleteFakeData () {
	fakeData.deleteFakeData();
}

function createFakeDevices () {
	fakeData.createFakeDevices();
}

function createFakeFolders () {
	fakeData.createFakeFolders();
}
