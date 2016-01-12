var fakeData = require("/data/fakeData");


$.printDeviceInViewBtn.addEventListener('click', function () {
    var blah = $.deviceInView;
    $.deviceInView.fetch();
    Ti.API.info("deviceInView: " + JSON.stringify(blah));
    $.output.value = JSON.stringify(blah);
});

$.printDeviceBtn.addEventListener('click', function () {
    var blah = $.device;
    blah.fetch();
    Ti.API.info("device: " + JSON.stringify(blah));
    $.output.value = JSON.stringify(blah);
});

$.printViewBtn.addEventListener('click', function () {
    var blah = Alloy.Collections.view;
    Alloy.Collections.view.fetch();
    Ti.API.info("view: " + JSON.stringify(blah));
    $.output.value = JSON.stringify(blah);
});

$.closeBtn.addEventListener('click', function () {
    Alloy.createController("index").getView().open();
    $.win.close();
});

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
