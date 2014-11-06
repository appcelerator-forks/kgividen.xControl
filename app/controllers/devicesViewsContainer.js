var myViews = {};

myViews[0] = Alloy.createController("devices", {viewId: VIEW_ID_FAVORITES});
myViews[1] = Alloy.createController("devices", {viewId: VIEW_ID_LIGHTS});
myViews[2] = Alloy.createController("devices", {viewId: VIEW_ID_SCENES});

_.each(myViews, function(v) {
    $.scrollableView.addView(v.getView());
});

//TODO This is to updated the status of the controls when the page changes.
// However, it would probably be better to update the status of the controls
// on every page when the control status changes instead of requerying
var viewNumber = 0;
$.scrollableView.addEventListener('scroll',function(e){
    if(viewNumber != e.currentPage){
        Ti.API.info("Page Changed!");
        viewNumber = e.currentPage; // And saving for next time change notification
        if(!_.isUndefined(e.currentPage)){
            myViews[e.currentPage].updateStatus();
        }
    }
});