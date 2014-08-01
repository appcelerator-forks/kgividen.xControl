if ($model) {
    var viewId = $.deviceRow.viewId;
//    Ti.API.info("model: " + JSON.stringify($model));
    var modelId = $model.id;
//    Ti.API.info("modelId: " + JSON.stringify(modelId)  + " viewID: " + viewId);

    var isModelInView = Alloy.Collections.deviceInView.where({DeviceId:modelId, ViewId:viewId}).length > 0;
    if(isModelInView){
        $.deviceRowSwitch.setValue(true);
    }else{
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
        Alloy.createModel('DeviceInView', model).save({silent: true});
    } else {
        //Remove record from DeviceInView
        var devices = Alloy.Collections.deviceInView.where({"DeviceId" : deviceId},{"ViewId":viewId});
        _.each(devices, function(device){
            device.destroy({silent: true});
        });
    }
});