var updateStatus = function (){
    return device.getAllDevicesStatus().then(updateLightsStatus);
};

exports.updateStatus = updateStatus;

function updateLightsStatus(nodesByAddressAndStatus){
    _.each($.scrollableView.getViews(), function(view){
        var viewSections = view.getSections();
        //We use viewSections[0] because we only have one section on each of the views.
        var items = (viewSections) ? viewSections[0].getItems() : null;
        if (viewSections && items){
            _.each(items, function(item, index){
                if (item.btn.type == 'light') {
                    var current = _.findWhere(nodesByAddressAndStatus, {address:item.btn.address});
                    if(current.level > 0){
                        //todo: Get this hardcoded image out of here some how
                        item.btn.backgroundImage = '/images/themes/default/btn-active.png';
                    } else {
                        //todo: Get this hardcoded image out of here some how
                        item.btn.backgroundImage = '/images/themes/default/btn.png';
                    }

                    item.slider.value = item.sliderLbl.text = current.level;
//                    viewSections[0].updateItemAt(index,item); //This would be great but it makes the refresh VERY slow.
                }
            });
        }
        viewSections[0].setItems(items);
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
        var imgTransform = Ti.UI.create2DMatrix().rotate(0,360);
        //Defines the Animation
        var myAnimation = Ti.UI.createAnimation({
            transform   :   imgTransform,      //Transform property to change during animation
            duration     : 800         //Duration for the animation in millisecond
        });
//        var t = Ti.UI.create2DMatrix();
//        var spin = Titanium.UI.createAnimation();
//        var clicks = 0;
//        clicks = clicks+1;
//        var degrees = clicks *10;
//        t = t.rotate(360);
//        spin.transform = t.rotate(360);
        $.refreshBtn.animate(myAnimation);
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
    var item = e.section.items[e.itemIndex];
    var itemType = item.btn.type;
    var address = item.btn.address;

    Ti.API.debug("item.btn.address: " + item.btn.address + " type: " + itemType);
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
//    Ti.API.debug("updateSliderLbl");
    var level = Math.round(e.source.value);
    var item = e.section.getItemAt(e.itemIndex);
//    Ti.API.debug("level: " + level);

    item.sliderLbl.text = level;  //Slider label
    //This needs to be done to update the sliderLBL but for now it doesn't work right because this conflicts with the update status
    //TODO Android makes the slider jerky if you update it
    if(osname == "ios") {
        e.section.updateItemAt(e.itemIndex, item);  //update the GUI
    }

}

function sendSliderVal(e) {
    Ti.API.debug("sendSliderVal");
    var item = e.section.getItemAt(e.itemIndex);
    Ti.API.debug("e: " + JSON.stringify(e));
    Ti.API.debug("address: " + JSON.stringify(item.btn.address));
    var itemType = e.bindId;
    var address = item.btn.address;


    if(address && itemType == "slider") {
        var level = Math.round(e.source.value);
        device.setLevel(address, level)
            .then(updateStatus());

        item.sliderLbl.text = level;  //Slider label
        item.slider.value = level;

        //TODO Android makes the slider jerky if you update it
        if(osname == "ios") {
            e.section.updateItemAt(e.itemIndex, item);  //update the GUI
        }
    }
}


//$.device.map(function(d){
//    var displayName = d.get("displayName");
//    var btn = Titanium.UI.createButton({
//        title: displayName,
//        class: "btn"
//    });
//    var slider = Titanium.UI.createSlider({
//        class: "slider"
//    });
//
//    var deviceItemView = Titanium.UI.createView({
//        class:"deviceItemView"
//    });
//    deviceItemView.add(btn);
//    deviceItemView.add(slider);
//
//    $.scrollView.add(deviceItemView);
//Add the button
//    var btn = Alloy.createWidget('com.netsmart.buttonToggle', null, {
//        "defaultState":"on",
//        "id":"toggleBtnWidget",
//        "title":displayName
//    });
//    $.scrollView.add(btn.getView());
//
//
////    Add the slider
//    var slider = Alloy.createWidget('com.netsmart.slider', null, {
//        "defaultState":"0",
//        "id":"sliderWidget"
//    });
//    $.scrollView.add(slider.getView());
//});