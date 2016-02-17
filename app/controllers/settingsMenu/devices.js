var parameters = arguments[0] || {};
// model passed to the controller from folders controller
$.folderModel = parameters.model;
$.navWin = parameters.navWin;
var preEditSectionAndItems = [];

/**
 * Function to fresh all devices in this folder
 * @param {Object} String
 */
function refreshDevicesInFolder(folderAddress) {
	var deviceInFolderTable = Alloy.Collections.deviceInFolder.config.adapter.collection_name;
	var deviceTable = Alloy.Collections.Device.config.adapter.collection_name;
	var sql = "SELECT * FROM xControlDevices INNER JOIN " + deviceInFolderTable +
		" ON " + deviceInFolderTable + ".DeviceAddress =  "+ deviceTable + ".address " +
		"WHERE " + deviceInFolderTable + ".FolderAddress = '" + folderAddress + "' ORDER BY SortId";

	Alloy.Collections.Device.fetch({
		query:sql,
		success: function () {
			Ti.API.debug("refreshDevicesInFolder Success!!!");
		},
		error: function () {
			Ti.API.debug("refreshDevicesInFolder Failed!!!");
		}
	});

	Ti.API.debug("refreshDevicesInFolder");

}

/**
 * Event listener set via view to be called on when the user taps the home-icon (Android)
 */
function closeWin() {
	'use strict';

	// close the window, showing the folders window behind it
	$.devicesWin.close();
}

/**
 * event listener set via view for when the user opens this window.
 * Calls the refresh folder to refresh all devices in the folder window.
 * @param
 */
function doOpen() {
	Ti.API.debug("Do Open!!!");
	refreshDevicesInFolder($.folderModel.get("address"));
}

/**
 * data event transform function for the ListView
 * @param  {Object} model
 */
function transform(model) {
	var transform = model.toJSON();
	var type = model.get("type");
	if($.editModeDevices == true && !OS_IOS) { //Only need to show new icons for Android
		transform.t = "editTemplate";
		return transform;
	} 

	if(type == "folder") {
		transform.t = "folderTemplate";
	} else if(type == "scene"){
		transform.t = "sceneTemplate";
	} else if(type == "sensor"){
		transform.t = "sensorTemplate";
	} else if(type == "program"){
		transform.t = "programTemplate";
	}

	return transform;
}

/**
 * data event filter for the ListView
 * @param  {Object} collection
 */
function filter(collection) {
	//return everything but folders.
	return collection.filter(function (device) {
		return device.get("type") !== 'folder';
	});
}

/**
 * Delete function to delete the model from the collection.
 * @param  {Object} item
 */
function deleteItem(item){
	var folderAddress = $.folderModel.get("address");

	var deviceAddress = item.properties.itemAddress;
	Ti.API.debug("Device address: " + deviceAddress + " FolderAddress: " + folderAddress);

	Alloy.Collections.deviceInFolder.fetch({
		success: function (data) {
			var devicesToDelete = data.where({"FolderAddress":folderAddress,"DeviceAddress":deviceAddress});
			_.each(devicesToDelete, function(device){
				device.destroy();
			});
			refreshDevicesInFolder($.folderModel.get("address")); 
		},
		error: function () {
			Ti.API.debug("delete Failed!!!");
		}
	});
}

/**
 * event listener set via view for when the user clicks the rename button.
 * @param  {Object} e Event
 */
function renameItemBtnClick(e){
	Ti.API.debug("itemClick e: " + JSON.stringify(e));
	var item = e.section.getItemAt(e.itemIndex);

	Ti.API.debug("editDeviceClicked");
	Ti.API.debug("item: " + JSON.stringify(item));
	var currentDevice = {
		address: item.properties.itemAddress,
		displayName: item.title.text
	};
	var win = Alloy.createController("settingsMenu/editDevice", {
		currentDevice: currentDevice,
		callback: function (event) {
			win.close();
		}
	}).getView();

	if (OS_IOS) {
		$.navWin.openWindow(win);
	} else {
		win.open(); //simply open the window on top for Android (and other platforms)
	}
}

/**
 * event listener set via view for when the user clicks the move up button.   Android Only
 * @param  {Object} e Event
 */
function moveUp(e){
	Ti.API.debug("IN moveUp!");
	var folderAddress = $.folderModel.get("address");
	//Get the item we clicked on.
	var item = e.section.getItemAt(e.itemIndex);
	Ti.API.debug("item : " + JSON.stringify(item));

	//Get the item above the item we clicked on
	var itemAbove = e.section.getItemAt(e.itemIndex - 1);
	Ti.API.debug("itemAbove : " + JSON.stringify(itemAbove));
	if(!itemAbove){  //first one in the list
		return;
	}

	var address = item.properties.itemAddress;
	var addressAbove = itemAbove.properties.itemAddress;
	Ti.API.debug("address : " + address + "addressAbove: " + addressAbove);
	Alloy.Collections.deviceInFolder.fetch({
		success: function (data) {
			Ti.API.debug("data: " + JSON.stringify(data));
			var modelInFolder = data.where({DeviceAddress: address, FolderAddress: folderAddress});
			Ti.API.debug("modelInFolder : " + JSON.stringify(modelInFolder));

			var modelInFolderAbove = data.where({DeviceAddress: addressAbove, FolderAddress: folderAddress});
			Ti.API.debug("modelInFolderAbove : " + JSON.stringify(modelInFolderAbove));

			//where returns an array but we just need the first one if it's there.
			if (modelInFolder.length > 0) {
				var newIndex = e.itemIndex - 1;
				modelInFolder[0].save({"SortId": newIndex}, {silent: true});
				modelInFolderAbove[0].save({"SortId": e.itemIndex}, {silent: true});
			}
			refreshDevicesInFolder(folderAddress);
		},
		error: function () {
		}
	});
}


/**
 * event listener set via view for when the user clicks the move down button.   Android Only
 * @param  {Object} e Event
 */
function moveDown(e){
	Ti.API.debug("IN moveDown!");
	var folderAddress = $.folderModel.get("address");
	var item = e.section.getItemAt(e.itemIndex);
	//Get the item below the item we clicked on

	var itemBelow = e.section.getItemAt(e.itemIndex + 1);
	if(!itemBelow){  //last one in the list
		return;
	}

	var address = item.properties.itemAddress;
	var addressBelow = itemBelow.properties.itemAddress;

	Alloy.Collections.deviceInFolder.fetch({
		success: function (data) {
			Ti.API.debug("data: " + JSON.stringify(data));

			var modelInFolder = data.where({DeviceAddress: address, FolderAddress: folderAddress});
			var modelInFolderBelow = data.where({DeviceAddress: addressBelow, FolderAddress: folderAddress});

			//where returns an array but we just need the first one if it's there.
			if (modelInFolder.length > 0) {
				var newIndex = e.itemIndex + 1;
				modelInFolder[0].save({"SortId": newIndex}, {silent: true});
				modelInFolderBelow[0].save({"SortId": e.itemIndex}, {silent: true});
			}

			refreshDevicesInFolder(folderAddress);
		},
		error: function () {
		}
	});
}


/**
 * event listener set via view for when the user clicks the move button.
 * @param  {Object} e Event
 */
$.devicesListView.addEventListener('move', reportMove);


/**
 * function called by the move event listener.
 * @param  {Object} e Event
 */
function reportMove(e) {
	Ti.API.debug("IN reportMove!");
	var item = e.section.getItemAt(e.itemIndex);
	Ti.API.debug('Item ' + e.itemIndex + ' was ' + e.type + 'd! and new index is ' + e.targetItemIndex);

	var folderAddress = $.folderModel.get("address");
	var deviceAddress = item.properties.itemAddress;

	Ti.API.debug("folderAddress: " + folderAddress + " deviceAddress: " + deviceAddress);

	Alloy.Collections.deviceInFolder.fetch({
		success: function (data) {
			var modelInFolder = data.where({DeviceAddress: deviceAddress, FolderAddress: folderAddress});
			Ti.API.debug("modelInFolder: " + JSON.stringify(modelInFolder));
			//where returns an array but we just need the first one if it's there.
			if (modelInFolder.length > 0) {
				modelInFolder[0].save({"SortId": e.targetItemIndex}, {silent: true});
			}
		},
		error: function () {}
	});
}

/**
 * Update the sort order of all the objects in the folder so they are consistent and not duplicated in the order.
 * @param
 */
function updateDeviceSortOrder(){
	Alloy.Collections.deviceInFolder.fetch({
		success: function (data) {
			var folderAddress = $.folderModel.get("address");
			var deviceList = $.devicesListSection.getItems();
			//Ti.API.debug("deviceList: " + JSON.stringify(deviceList));
			var i = 0;
			_.each(deviceList, function (device) {
				var deviceAddress = device.properties.itemAddress;
				if(deviceAddress) {
					//if device is in the deviceInFolder set it's sort order to i.
					//Ti.API.debug("saved deviceAddress: " + deviceAddress + "to sortorder: " + i);
					var modelInFolder = data.where({DeviceAddress: deviceAddress, FolderAddress: folderAddress});
					//where returns an array but we just need the first one if it's there.
					if (modelInFolder.length > 0) {
						modelInFolder[0].save({"SortId": i}, {silent: true});
					}
					i++;
				}
			});
		},
		error: function () {}
	});

}


/**
 * This is used for the iOS delete.  We load up all the sections and items so we can look it up
 * since once the delete event happens they're no longer there.
 * @param
 */
var setPreEditSectionAndItems = function () {
	preEditSectionAndItems = _.map($.devicesListView.sections, function (section) {
		return {
			items: _.map(section.items, function (item) {
				return item;
			})
		};
	});
};

/**
 * event listener set via view for when the user clicks one of the devices edit button.
 * @param  {Object} e Event
 */
function editDevicesBtnClicked(e) {
	if (OS_IOS) {
		setPreEditSectionAndItems();
	}

	var btn = e.source;
	if (!$.editModeDevices) {
		btn.title = "Done";
		$.editModeDevices = true;
		if (OS_IOS) {
			$.devicesListView.setEditing(true);
		} else {
			updateUI(); //We need to run updateUI so the new transform will work now that we are in editMode.
		}
		$.addDevicesFab.hideMe();
	} else {
		btn.title = "Edit";
		$.editModeDevices = false;
		if (OS_IOS) {
			$.devicesListView.setEditing(false);
			updateDeviceSortOrder(); //This is so all of them are numbered correctly because the default is 0
		} else {
			updateUI();
		}
		$.addDevicesFab.showMe();
	}
}

/**
 * event listener set via view for when the user clicks the edit button.
 * It then reacts to the RENAME or DELETE.  IOS only
 * @param  {Object} e Event
 */
if (OS_IOS) {
	function onEditactionClick (e) {
		Ti.API.debug("onEditactionClick e: " + JSON.stringify(e));
		$.editDevicesBtn.title = "Edit";
		$.devicesListView.setEditing(false);
		$.addDevicesFab.showMe();
		if(e.action=="RENAME") {
			renameItemBtnClick(e);
		} else if (e.action=="DELETE") {
			if(preEditSectionAndItems.length > 0){
				var item = preEditSectionAndItems[e.sectionIndex].items[e.itemIndex]; //This should be the same assuming the maps are correct in the preEditSectionItems
			} else {
				var item = e.section.getItemAt(e.itemIndex);
			}
			deleteItem(item);
		}
	}



} else {
	/**
	 * event listener set via view for when the user clicks the delete button.  AndroidOnly
	 * @param  {Object} e Event
	 */
	//ios can swipe to delete so we don't need to do this
	function deleteBtnClick(e){
		Ti.API.debug("e" + JSON.stringify(e));
		var item = e.section.getItemAt(e.itemIndex);
		var dialog = Ti.UI.createAlertDialog({
			title: 'Do you want to remove this device from the folder?',
			buttonNames: ['Yes', 'No']
		});

		dialog.addEventListener('click', function (e) {
			if (e.index == 0) {
				deleteItem(item);
			}
		});
		dialog.show();
	}
}


/**
 * event listener set via view for when the user clicks the floating add button.
 */
$.addDevicesFab.onClick(function (e) {
	var win = Alloy.createController("settingsMenu/addDevice", {
		folderModel: $.folderModel,
		callback: function (event) {
			win.close();
			if(OS_IOS) {
				updateDeviceSortOrder();
			}
			refreshDevicesInFolder($.folderModel.get("address"));
		}
	}).getView();

	//open the window in the NavigationWindow for iOS
	if (OS_IOS) {
		$.navWin.openWindow(win);
	} else {
		win.open();   //simply open the window on top for Android (and other platforms)
	}
});

/**
 * event listener set via view to provide a search of the ListView.
 * @param  {Object} e Event
 */
$.sf.addEventListener('change',function(e){
	$.devicesListView.searchText = e.value;
});

/**
 * event listener to destroy all event listeners setup by Alloy.
 */
$.devicesWin.addEventListener("close", function(){
	$.destroy();
});


