var parameters = arguments[0] || {};
var folderAddress = parameters.folderModel.get("address");
var callbackFunction = parameters.callback || null;

/**
 * event listener added via view for the refreshControl (iOS) or button (Android)
 * @param  {Object} e Event, unless it was called from the constructor
 */
function refresh(e) {
    Ti.API.info("In refresh");
    'use strict';
    getListOfDevicesInFolder(function(e){
        // Get all the devics in the folder and check them if they already have been added.
        Alloy.Collections.Device.fetch({
            success: function (col) {
                var devicesInFolder = e.devices;
                if (e.status === "success") {
                    col.each(function(item) {
                        var address = item.get("address");
                        // Either turn it into a JSON object or figure out why where doesn't work.
                        Ti.API.debug("devices InFolder: " + JSON.stringify(devicesInFolder));
                        Ti.API.debug("address: " + JSON.stringify(address));

                        //We have to put the array of models back into a temporary collection so we can do a where
                        var tempCol = Alloy.Collections.instance("DeviceInFolder").reset(devicesInFolder);
                        var found = tempCol.where({"FolderAddress":folderAddress,"DeviceAddress":address});

                        if (found.length > 0) {
                            //adds a checkmark if it's in the folder
                            //This is so we know it's in the folder and won't repeat add it if it's clicked
                            item.set(
                                {
                                    accessoryType:Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK,
                                    inFolder:true
                                }
                            );
                        }
                    });
                }
            },
            error: function (){
                Ti.API.debug("Error getting Device");
            }
        });
    });
}
/**
 * event listener added via view for the when the window closes.
 * @param  {Object} e Event, unless it was called from the constructor
 */
function exit (){
    callbackFunction && callbackFunction();
}

function getListOfDevicesInFolder(callback) {
    //See if the device is already in the view
    Alloy.Collections.Device.fetch({
        success: function (data) {
            var modelsInFolder = data.where({FolderAddress: folderAddress});
            var e = {
                status:"success",
                devices:modelsInFolder
            };
            callback && callback(e);
        },
        error: function () {
            Ti.API.debug("Setting accessory type Failed!!!");
            var e = {
                status:"error"
            };
            callback && callback(e);
        }
    });
}

function transform(model) {
    var transform = model.toJSON();
    var type = model.get("type");
    //lightTemplate is the default
    if(type == "folder") {
        transform.t = 'folderTemplate';
    } else if(type == "scene"){
        transform.t = 'sceneTemplate';
    }

    return transform;
}

function filter(collection) {
    //return everything but folders.
    return collection.filter(function (device) {
        return device.get("type") !== 'folder';
    });
}

$.addDeviceListView.addEventListener('itemclick',function(e) {
    addDeviceRowClicked(e);
});

function addDeviceRowClicked(event) {
    var item = event.section.getItemAt(event.itemIndex);
    //Add a device into a Folder if it's not already there.
    if (!item.properties.inFolder) {
        var model = {
            "DeviceAddress" : item.properties.address,
            "FolderAddress" : folderAddress,
            "SortId" : 0
        };

        Alloy.createModel('DeviceInFolder', model).save({},{
            success: function(resp){
                item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
                event.section.updateItemAt(event.itemIndex,item);

            },
            error: function(resp) {
                Ti.API.debug("error!!!!!");
            }
        });
    }

}

/**
 * event listener to destroy all event listeners setup by Alloy.
 */
$.addDeviceWindow.addEventListener("close", function(){
    $.destroy();
});

/**
 * event listener set via view to provide a search of the ListView.
 * @param  {Object} e Event
 */
$.sf.addEventListener('change',function(e){
    $.addDeviceListView.searchText = e.value;
});