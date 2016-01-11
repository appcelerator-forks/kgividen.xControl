var fakeData = require("/data/fakeData");
fakeData.createFakeData();

$.printDeviceInViewBtn.addEventListener('click', function () {
    var blah = $.deviceInView;
    $.deviceInView.fetch();
    Ti.API.info("deviceInView: " + JSON.stringify(blah));
    $.output.value = JSON.stringify(blah);
});

$.printFolderInViewBtn.addEventListener('click', function () {
    var blah = $.folderInView;
    $.folderInView.fetch();
    Ti.API.info("folderInView: " + JSON.stringify(blah));
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

// $.printSortByIdBtn.addEventListener('click', function () {
    // var blah = $.device;
    // blah.sortById(1);
    // Ti.API.info("printSortById: " + JSON.stringify(blah));
    // $.output.value = JSON.stringify(blah);
// });

$.printSortByIdBtn.addEventListener('click', function () {
    var blah = $.device;
    blah.getSortedFoldersInView(1);
    // blah.sortById(1);
    Ti.API.info("printSortById: " + JSON.stringify(blah));
    $.output.value = JSON.stringify(blah);
});

$.closeBtn.addEventListener('click', function () {
    Alloy.createController("index").getView().open();
    $.win.close();
});