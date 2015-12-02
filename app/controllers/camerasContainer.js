var myViews = {};

myViews[0] = Alloy.createController("camera", {url: "http://192.168.111.6/snapshot.cgi?user=kgividen&pwd=xabler"});
myViews[1] = Alloy.createController("camera", {url: "http://192.168.111.8/snapshot.cgi?user=kgividen&pwd=xabler"});
//myViews[0] = Alloy.createImageView();

_.each(myViews, function(v) {
    $.scrollableView.addView(v.getView());
});

//LISTENERS
$.closeBtn.addEventListener('click', function () {
    Alloy.createController("index").getView().open();
    $.win.close();
});


