var updateStatus = function (){
    return device.getAllDevicesStatus().then(updateLightsStatus);
};

exports.updateStatus = updateStatus;

function updateLightsStatus(nodesByAddressAndStatus){
    _.each($.scrollableView.getViews(), function(view){
        if (view.getData()[0] && view.getData()[0].getRows()){
            _.each(view.getData()[0].getRows(), function(row){
                if(row.model.type == 'light') {
                    var btn = row.getChildren()[0].getChildren()[0];   //todo: this is crashing android.
                    var current = _.findWhere(nodesByAddressAndStatus, {address:btn.address});

                    if(current.level > 0){
                        $.removeClass(btn, 'btnOff');
                        $.addClass(btn, 'btnOn');
                        $.addClass(btn, 'btn');
                    } else {
                        $.addClass(btn, 'btnOff');
                        $.addClass(btn, 'btn');
                    }
                    var sliderContainer = row.getChildren()[0].getChildren()[1];
                    //slider
                    sliderContainer.getChildren()[0].value = current.level;
                    //sliderLbl
                    sliderContainer.getChildren()[1].text = current.level;
                }
            });
        }
    });
}



function favFilter(collection){
    return collection.where({
        ViewId:VIEW_ID_FAVORITES
    });
}

function lightFilter(collection){
    return collection.where({
        ViewId:VIEW_ID_LIGHTS
    });
}

function sceneFilter(collection){
    return collection.where({
        ViewId:VIEW_ID_SCENES
    });
}

$.device.whereShow();
updateStatus();

//LISTENERS
$.scrollableView.addEventListener("close", function(){
    $.destroy();
    Ti.API.info("DESTROY TABLEVIEW!!!");
});

if(osname == "android"){
//    $.refreshControlBtn.addEventListener('click', function () {
//        return device.getAllDevicesStatus()
//            .then(updateLightsStatus);
//    });
}

if(osname == "ios") {
    //todo: There should be a better way to do this rather than duplicate the control
    // but if the same one is added to multiple tableViews things crap out
    $.refreshControlFav.addEventListener('refreshstart', function refreshControl(){
        Ti.API.debug("Inside refresh control");
        return device.getAllDevicesStatus()
            .then(updateLightsStatus)
            .then(function () {
                $.refreshControlFav.endRefreshing();
            });
    });

    $.refreshControlLights.addEventListener('refreshstart', function refreshControl(){
        Ti.API.debug("Inside refresh control");
        return device.getAllDevicesStatus()
            .then(updateLightsStatus)
            .then(function () {
                $.refreshControlLights.endRefreshing();
            });
    });

    $.refreshControlScenes.addEventListener('refreshstart', function refreshControl(){
        Ti.API.debug("Inside refresh control");
        return device.getAllDevicesStatus()
            .then(updateLightsStatus)
            .then(function () {
                $.refreshControlLights.endRefreshing();
            });
    });
}
//Buttons
$.scrollableView.addEventListener('click', function(e) {
    if(e.source.address && e.source.id == "btn"){
        device.toggle(e.source.address)
            .then(updateStatus());
    }
    if(e.source.address && e.source.id == "sceneBtnOn"){
        device.sceneOn(e.source.address);
    }
    if(e.source.address && e.source.id == "sceneBtnOff"){
        device.sceneOff(e.source.address);
    }
});

$.scrollableView.addEventListener('touchend', function(e) {
    if(e.source.id == "slider") {
        var level = Math.round(e.source.value);
        device.setLevel(e.source.address, level)
            .then(updateStatus());
        e.row.getChildren()[0].getChildren()[1].getChildren()[1].text = level;  //Slider label
    }
});
