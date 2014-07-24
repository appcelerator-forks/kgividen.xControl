var viewName = "showInFavoritesView"

//This is used for adding the correct viewName to the model/collection for the table view.
function transformFunction(model) {
    var transform = model.toJSON();
    transform.viewName = viewName;
    return transform;
}

function refreshDevices(){
    device.getListOfDevices().then(function (data) {
        var devices = Alloy.Collections.device;  //Alloy.Collections.device is defined in alloy.js

        //add all of the defaults if they aren't there for the model
        _.each(data,function(item){
            _.defaults(item,{id:item.address}, {displayName:item.name}, {parent:"unkown"}, {type:"unknown"});
            if(item.type == "scene") {
                item.showInScenesView = 1;
            } else if (item.type =="folder"){
                item.showInLightingView = 1;
                item.showInFavoritesView = 1;
            } else {
                item.showInLightingView = 1;
            }
        });

        //Add all of the new records in the collection that came from the hardware device.
        _.each(data, function (item) {
            //We only want to add new devices.
            var deviceArray = devices.where({address: item.address});  //get the model from the collection if it's already been added.
            if (!deviceArray[0]) {
                Ti.API.info("created device model: " + JSON.stringify(item));
                var deviceModel = Alloy.createModel('Device', item);
                deviceModel.save();
            }
        });
        devices.fetch();
    });
}
//LISTENERS

$.closeBtn.addEventListener('click', function () {
    Ti.API.info("CLOSING!!!!"); //TODO add an indicator here.
    var devices = Alloy.Collections.device;
    var i = 0;
    $.win.close();
    if($.devicesTableView.data[0]) {
        var deviceTvData = $.devicesTableView.data[0].rows;
        //todo: Reordering the devices but there has to be a better way to do this...
        _.each(deviceTvData, function (d) {
            var model = devices.get(d.alloy_id);
            model.save({sortId: i}, {silent: true});
            i++;
        });
    }
});

$.win.addEventListener("close", function(){
    $.destroy();
    Ti.API.info("DESTROYING!!!!");
});

$.win.addEventListener("open", function(){
    Alloy.Collections.device.fetch();
    refreshDevices();
    $.chooseViewBar.index = 0;
});

$.chooseViewBar.addEventListener("click", function(e){
    Ti.API.info(e.index);
    switch(e.index) {
        case 0:
            Ti.API.info("favorites");
            viewName = "showInFavoritesView";
            updateUI(); //This calls the dataFunction in the view.
            break;
        case 1:
            Ti.API.info("lighting");
            viewName = "showInLightingView";
            updateUI();
            break;
        case 2:
            Ti.API.info("scenes");
            viewName = "showInScenesView";
            updateUI();
            break;
        default:
            Ti.API.info("favorites");
    }
});