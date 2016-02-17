var parameters = arguments[0] || {};
var folderAddress = parameters.folderModel.get("address");
var callbackFunction = parameters.callback || null;
/**
 * event listener added via view for the refreshControl (iOS) or button (Android)
 * @param  {Object} e Event, unless it was called from the constructor
 */
function refresh(e) {
    'use strict';
    getListOfDevicesInFolder(function(e){
        // Get all the devics in the folder and check them if they already have been added.
        Alloy.Collections.Device.fetch({
            success: function (data) {
                var devicesInFolder = _.pluck(e.devices,"DeviceAddress");
                if (e.status === "success") {
                	//Check of any of the devices are already in the folder and if so then check them.
                    data.each(function(item) {
                        if (_.contains(devicesInFolder, item.get("address"))) {
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
    Alloy.Collections.DeviceInFolder.fetch({
        success: function (data) {
            var devicesInFolder = _.where(data.toJSON(),{FolderAddress: folderAddress});
           
            var e = {
                status:"success",
                devices:devicesInFolder
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
    //dimmerTemplate is the default
    if(type == "folder") {
        transform.t = 'folderTemplate';
    } else if(type == "scene"){
        transform.t = 'sceneTemplate';
    } else if(type == "sensor"){
        transform.t = 'sensorTemplate';
    } else if(type == "program"){
        transform.t = 'programTemplate';
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
    //Add a device into a Folder if it's not already there.  Remove it if it is there.
    if (!item.properties.inFolder) {
        var model = {
            "DeviceAddress" : item.properties.address,
            "FolderAddress" : folderAddress,
            "SortId" : 0
        };

        Alloy.createModel('DeviceInFolder', model).save({},{
            success: function(resp){
                item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
                item.properties.inFolder = true;
                event.section.updateItemAt(event.itemIndex,item);
            },
            error: function(resp) {
                Ti.API.debug("error!!!!!");
            }
        });
    } else {
		Alloy.Collections.deviceInFolder.fetch({
			success: function (data) {
				var devicesToDelete = data.where({"FolderAddress":folderAddress,"DeviceAddress":item.properties.address});
				
				_.each(devicesToDelete, function(device){
					device.destroy();
				});
				item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
                item.properties.inFolder = false;
                event.section.updateItemAt(event.itemIndex,item);
			},
			error: function () {
				Ti.API.debug("delete Failed!!!");
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