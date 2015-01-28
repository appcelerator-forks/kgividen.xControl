var updateStatus = function (){
    return device.getAllDevicesStatus().then(updateLightsStatus);
};

exports.updateStatus = updateStatus;

function updateLightsStatus(nodesByAddressAndStatus){
     Ti.API.debug("In Update Lights Status!!!!!");
    _.each($.scrollableView.getViews(), function(view){
        var viewSections = view.getSections();
        //TODO: this will only update the favorites view since it's viewSections[0]
        var items = (viewSections) ? viewSections[0].getItems() : null;
        if (viewSections && items){
            _.each(items, function(item, index){
                if (item.properties.itemType == 'light') {
                    var current = _.findWhere(nodesByAddressAndStatus, {address:item.properties.address});
                    Ti.API.debug("current" + JSON.stringify(current));
                    if(current.level > 0){
                        //todo: Get this hardcoded image out of here some how
                       item.btn.backgroundImage = '/images/themes/default/btn-active.png';
                    } else {
                        //todo: Get this hardcoded image out of here some how
                        item.btn.backgroundImage = '/images/themes/default/btn.png';
                    }

                    item.slider.value = item.sliderLbl.text = current.level;
                    viewSections[0].updateItemAt(index, item);  //update the GUI
                }
            });
        }
    });
}

function favFilter(collection) {
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
    $.refreshBtn.addEventListener('click', function () {
        Ti.API.debug("Inside refresh control");
        return device.getAllDevicesStatus()
            .then(updateLightsStatus);
    });
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


//This is used for adding the correct viewId to the model/collection for the table view.
function transformFunction(model) {
    var transform = model.toJSON();
    transform.type = model.type;
    transform.modelId = model.id;
    transform.sliderVal = 0;
    transform.address = model.address;

    //default template is a light otherwise pick one of these
    if(model.get("type") == "folder") {
        transform.template = "groupLbl";
    }

    if(model.get("type") == "scene") {
        transform.template = "scene";
    }

    return transform;
}


//***************ON EVENTS CALLED FROM THE XML *********************
function btnClick(e){
    Ti.API.debug("btnClick");
    var item = e.section.items[e.itemIndex];
    var itemType = item.properties.itemType;
    var address = item.properties.address;

    if(!address){
        return;
    }
    if(itemType == "light"){
        device.toggle(address)
            .then(updateStatus());
    }
    if(itemType == "sceneBtnOn"){
        device.sceneOn(address);
        //todo: update status here?
    }
    if(itemType == "sceneBtnOff"){
        device.sceneOff(address);
    }
}

function updateSliderLbl(e) {
    Ti.API.debug("updateSliderLbl");
//    Ti.API.debug("e: " + JSON.stringify(e));
    var level = Math.round(e.source.value);
    var section = e.section;
    Ti.API.debug("e.itemIndex: " + JSON.stringify(e.itemIndex));
    Ti.API.debug("e.itemIndex.sliderLbl: " + JSON.stringify(e.itemIndex.sliderLbl));

    var item = section.getItemAt(e.itemIndex);
    Ti.API.debug("item: " + JSON.stringify(item));

    item.sliderLbl.text = level;  //Slider label
    //TODO Android makes the slider jerky if you update it
    if(osname == "ios") {
        section.updateItemAt(e.itemIndex, item);  //update the GUI
    }
}

function sendSliderVal(e) {
    Ti.API.debug("sendSliderVal");
//    Ti.API.debug("e: " + JSON.stringify(e));

    var item = e.section.items[e.itemIndex];
    var itemType = e.bindId;;
    var address = item.properties.address;

    Ti.API.debug("itemType: " + itemType);
    Ti.API.debug("address: " + address);


    if(address && itemType == "slider") {
        var level = Math.round(e.source.value);
        Ti.API.debug("e: " + JSON.stringify(e));
        device.setLevel(address, level)
            .then(updateStatus());

        item.sliderLbl.text = level;  //Slider label
        //TODO Android makes the slider jerky if you update it
        if(osname == "ios") {
            e.section.updateItemAt(e.itemIndex, item);  //update the GUI
        }
    }
}