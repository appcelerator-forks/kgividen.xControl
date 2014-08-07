$.printDeviceInViewBtn.addEventListener('click', function () {
    var blah = Alloy.Collections.deviceInView;
    Alloy.Collections.deviceInView.fetch();
    Ti.API.info("deviceInView: " + JSON.stringify(blah));
    $.output.value = JSON.stringify(blah);
});

$.printDeviceBtn.addEventListener('click', function () {
    var blah = Alloy.Collections.device;
    Alloy.Collections.device.fetch();
    Ti.API.info("device: " + JSON.stringify(blah));
    $.output.value = JSON.stringify(blah);
});

$.printViewBtn.addEventListener('click', function () {
    var blah = Alloy.Collections.view;
    Alloy.Collections.view.fetch();
    Ti.API.info("view: " + JSON.stringify(blah));
    $.output.value = JSON.stringify(blah);
});

$.printSortByIdBtn.addEventListener('click', function () {
    var blah = Alloy.Collections.device;
    Alloy.Collections.device.sortById(1);
    Ti.API.info("printSortById: " + JSON.stringify(blah));
    $.output.value = JSON.stringify(blah);
});

$.closeBtn.addEventListener('click', function () {
    Alloy.createController("index").getView().open();
    $.win.close();
});