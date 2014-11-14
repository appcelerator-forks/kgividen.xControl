if ($model) {
//    Ti.API.info("settingsDeviceRow model: " + JSON.stringify($model));
    var viewId = $.deviceRow.viewId;
    var modelId = $model.id;

    var isModelInView = Alloy.Collections.deviceInView.where({DeviceId:modelId, ViewId:viewId}).length > 0;
    if(isModelInView){
//        Ti.API.debug("Switch should be true");
        $.deviceRowSwitch.setValue(true);
    }else{
//        Ti.API.debug("Switch should be false");
        $.deviceRowSwitch.setValue(false);
    }
}

$.deviceRowSwitch.addEventListener('change', function(e) {
    var deviceId = $model.id;
    var model = {
        "DeviceId" : deviceId,
        "ViewId" : viewId,
        "SortId" : 0
    };
    if(e.value){
        //Add record to DeviceInView
//        Ti.API.info("Add record to DeviceInView: " + JSON.stringify(model));
        Alloy.createModel('DeviceInView', model).save({silent: true});
    } else {
        //Remove record from DeviceInView
//        Ti.API.info("Remove record from DeviceInView: " + JSON.stringify(model) + " viewID: " + viewId);
        var devices = Alloy.Collections.deviceInView.where({"DeviceId" : deviceId, "ViewId":viewId});
        _.each(devices, function(device){
            device.destroy({silent: true});
        });
    }
});