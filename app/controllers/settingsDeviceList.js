
//LISTENERS
$.refreshDevicesBtn.addEventListener('click', function () {
    device.getListOfDevices().then(function (data) {
        var devices = Alloy.Collections.device;  //Alloy.Collections.device is defined in alloy.js

        //add all of the defaults if they aren't there for the model
        _.each(data,function(item){
            _.defaults(item,{id:item.address}, {displayName:item.name}, {showInLightingView:1}, {parent:"unkown"}, {type:"unknown"});
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
});

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
});