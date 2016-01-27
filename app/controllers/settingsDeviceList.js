// var viewId = 0;
// 
// //This is used for adding the correct viewId to the model/collection for the table view.
// function transformFunction(model) {
    // var transform = model.toJSON();
    // transform.viewId = viewId;
    // transform.modelId = model.id;
// 
    // var type = model.get("type");
    // if(type == "folder") {
        // transform.typeIcon = '\uf114';
    // } else if(type == "scene"){
        // transform.typeIcon = '\uf042';
    // } else if(type == "light"){
        // transform.typeIcon = '\uf0eb';
    // }
// 
     // //Check to see if model is in the current view
    // transform.deviceRowSwitchVal = $.deviceCollection.where({DeviceId:model.id, ViewId:viewId}).length > 0;
// 
    // return transform;
// }
// 
// function addToView(deviceId, viewId) {
    // Ti.API.info("in Save...deviceId: " + deviceId + " viewId: " + viewId);
    // var model = {
        // "DeviceId" : deviceId,
        // "ViewId" : viewId
    // };
    // Ti.API.info("Added this deviceId: " + deviceId + " to viewID: " + viewId);
    // Alloy.createModel('DeviceInView', model).save({silent: true});
// }
// 
// function refreshDevices(){
    // //device is set in alloy.js
    // device.getListOfDevices().then(function (data) {
        // //TODO Take out fake data line
// //        data = fakeData;
        // _.each(data,function(item){
            // //add all of the defaults if they aren't there for the model
            // _.defaults(item,{displayName:item.name}, {parent:"unknown"}, {type:"unknown"});
        // });
// 
        // //Add all of the new records in the collection that came from the hardware device.
        // var devicesInDB = $.deviceCollection;
        // devicesInDB.sortById(viewId);
// 
        // _.each(data, function (item) {
            // //We only want to add new devicesInDB.
            // var deviceArray = [];
            // if(devicesInDB){
                // deviceArray = devicesInDB.where({address: item.address}); //get the model from the collection if it's already been added.
            // }
            // if (!deviceArray[0]) {
// //                Ti.API.info("NOT DUPLICATE!!!! deviceArray[0]: " + JSON.stringify(deviceArray[0]));
                // var deviceModel = Alloy.createModel('Device', item);
                // deviceModel.save({silent: true});
// 
                // //add them into their categories and one of them into the favorites.
                // if(deviceModel.get('type') == "scene") {
                    // addToView(deviceModel.id, VIEW_ID_SCENES);
                // } else if (deviceModel.get('type') == "folder"){
                    // addToView(deviceModel.id, VIEW_ID_LIGHTS);
                // } else {
                    // addToView(deviceModel.id, VIEW_ID_LIGHTS);  //add to lighting view
                // }
            // }else{
// //                Ti.API.info("DUPLICATE!!!!");
            // }
        // });
// 
        // $.deviceInViewCollection.fetch();   //we need to still fetch this even though deviceCollection.sortById has it because we use this when removing it from a group.
        // $.deviceCollection.sortById(viewId);
    // });
// }
// 
// $.deviceListView.addEventListener('move', reportMove);
// function reportMove (e) {
    // Ti.API.debug("IN reportMove!");
// 
    // var item = e.section.getItemAt(e.itemIndex);
    // var deviceId = item.properties.modelId;
    // Ti.API.debug('Item ' + e.itemIndex + ' was ' + e.type + 'd! and new index is ' + e.targetItemIndex);
    // Ti.API.debug("e:" + JSON.stringify(e));
// 
    // var modelInView = $.deviceInViewCollection.where({DeviceId: deviceId, ViewId: viewId});
    // Ti.API.info("modelInView: " + JSON.stringify(modelInView));
    // //where returns an array but we just need the first one if it's there.
    // if (modelInView.length > 0) {
        // modelInView[0].save({"SortId": e.targetItemIndex}, {silent: true});
    // }
// 
// }
// //TODO refactor
// function updateViewsSortOrder(viewId){
    // $.deviceInViewCollection.fetch(); //We need to fetch again cause if we added it via the on/off button we need to refresh that's it's there.
// //    $.deviceCollection.sortById(viewId); //We need to fetch again cause if we added it via the on/off button we need to refresh that's it's there.
    // var deviceList = $.deviceListSection.getItems();
    // Ti.API.debug("deviceList: " + JSON.stringify(deviceList));
    // var i = 0;
    // _.each(deviceList, function (device) {
        // var modelId = device.properties.modelId;
        // if(modelId) {
            // //if device is in the deviceInView set it's sort order to i.
            // var modelInView = $.deviceInViewCollection.where({DeviceId: modelId, ViewId: viewId});
            // //where returns an array but we just need the first one if it's there.
            // if (modelInView.length > 0) {
                // modelInView[0].save({"SortId": i}, {silent: true});
            // }
            // i++;
        // }
    // });
// }
// 
// //onchange event for the Switch on the ListItem
// function deviceRowSwitchChanged(e) {
    // Ti.API.debug("IN DeviceRowSwitched!");
    // Ti.API.debug("e: " + JSON.stringify(e));
    // Ti.API.debug("e value: " + JSON.stringify(e.value));
// 
    // var section = $.deviceListView.sections[e.sectionIndex];
    // var item = section.getItemAt(e.itemIndex);
// 
// //    var item = e.section.getItemAt(e.itemIndex);
    // Ti.API.debug("item properties: " + JSON.stringify(item.properties));
    // var deviceId = item.properties.modelId;
    // if (e.value) {
        // //Add record to DeviceInView
        // var model = {
            // "DeviceId" : deviceId,
            // "ViewId" : viewId,
            // "SortId" : 0
        // };
        // Ti.API.debug("Add record: " + JSON.stringify(model));
        // Alloy.createModel('DeviceInView', model).save({silent: true});
// //        Alloy.createModel('DeviceInView', model).save();
    // } else {
        // //Remove record from DeviceInView
        // Ti.API.debug("Remove deviceId: " + deviceId + " from viewID: " + viewId);
        // var devices = $.deviceInViewCollection.where({"DeviceId" : deviceId, "ViewId":viewId});
        // _.each(devices, function(device){
            // device.destroy({silent: true});
// //            device.destroy();
        // });
    // }
// //    $.deviceInViewCollection.fetch();
// }
// //***************************LISTENERS**********************
// $.closeBtn.addEventListener('click', function () {
    // updateViewsSortOrder(viewId);
    // Alloy.createController("index").getView().open();
    // $.win.close();
// });
// 
// $.win.addEventListener("close", function(){
    // //$.destroy();
    // //Ti.API.info("DESTROYING!!!!");
// });
// 
// $.win.addEventListener("open", function(){
    // refreshDevices();
    // $.chooseViewBar.index = 0;
// });
// 
// $.chooseViewBar.addEventListener("click", function(e){
    // switch(e.index) {
        // case 0:
            // updateViewsSortOrder(viewId);
            // viewId = VIEW_ID_FAVORITES;
            // $.deviceCollection.sortById(viewId);
            // updateUI();
            // break;
        // case 1:
            // updateViewsSortOrder(viewId);
            // viewId = VIEW_ID_LIGHTS;
            // $.deviceCollection.sortById(viewId);
            // updateUI();
            // break;
        // case 2:
            // updateViewsSortOrder(viewId);
            // viewId = VIEW_ID_SCENES;
            // $.deviceCollection.sortById(viewId);
            // updateUI();
            // break;
        // default:
            // updateViewsSortOrder(viewId);
            // viewId = VIEW_ID_FAVORITES;
            // $.deviceCollection.sortById(viewId);
            // updateUI(); //This calls the dataFunction in the view.
    // }
// });
// 
// function updateDisplayName(e){
    // Ti.API.debug("IN updateDisplayName!");
// 
    // var section = $.deviceListView.sections[e.sectionIndex];
    // if(!_.isUndefined(e.itemIndex) && (!_.isUndefined(section))) {
        // var item = section.getItemAt(e.itemIndex);
        // var deviceModel = $.deviceCollection.get(item.properties.modelId);
        // deviceModel.set({"displayName": e.value});
        // deviceModel.save({silent: true});
    // }
// }
// 
// //ANDROID MOVE ORDER OF ROWS IN TABLE VIEW CODE
// function moveUp(e){
    // Ti.API.debug("IN moveUp!");
// 
    // //Get the item we clicked on.
    // var item = e.section.getItemAt(e.itemIndex);
    // //Get the item above the item we clicked on
    // var itemAbove = e.section.getItemAt(e.itemIndex - 1);
    // Ti.API.debug("itemAbove : " + JSON.stringify(itemAbove));
    // if(!itemAbove){  //first one in the list
        // return;
    // }
// 
    // var deviceId = item.properties.modelId;
    // var deviceIdAbove = itemAbove.properties.modelId;
// 
    // var modelInView = $.deviceInViewCollection.where({DeviceId: deviceId, ViewId: viewId});
    // var modelInViewAbove = $.deviceInViewCollection.where({DeviceId: deviceIdAbove, ViewId: viewId});
// 
    // //where returns an array but we just need the first one if it's there.
    // if (modelInView.length > 0) {
        // var newIndex = e.itemIndex-1;
        // modelInView[0].save({"SortId": newIndex}, {silent: true});
        // modelInViewAbove[0].save({"SortId": e.itemIndex}, {silent: true});
    // }
// 
    // $.deviceCollection.sortById(viewId);
// 
// }
// 
// function moveDown(e){
    // Ti.API.debug("IN moveDown!");
// 
    // var item = e.section.getItemAt(e.itemIndex);
    // //Get the item below the item we clicked on
// 
    // var itemBelow = e.section.getItemAt(e.itemIndex + 1);
    // if(!itemBelow){  //last one in the list
        // return;
    // }
// 
    // var deviceId = item.properties.modelId;
    // var deviceIdBelow = itemBelow.properties.modelId;
// 
    // var modelInView = $.deviceInViewCollection.where({DeviceId: deviceId, ViewId: viewId});
    // var modelInViewBelow = $.deviceInViewCollection.where({DeviceId: deviceIdBelow, ViewId: viewId});
// 
    // //where returns an array but we just need the first one if it's there.
    // if (modelInView.length > 0) {
        // var newIndex = e.itemIndex+1;
        // modelInView[0].save({"SortId": newIndex}, {silent: true});
        // modelInViewBelow[0].save({"SortId": e.itemIndex}, {silent: true});
    // }
// 
    // $.deviceCollection.sortById(viewId);
// }
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// //FAKE DATA
// 
// var fakeData = [
    // {
        // "name": "Kitchen Folder",
        // "address": "29763",
        // "type": "folder"
    // },
    // {
        // "name": "Backyard Floods",
        // "parent": "29763",
        // "type": "light",
        // "address": "20 88 48 1"
    // },
    // {
        // "name": "Kitchen 3way",
        // "parent": "29763",
        // "type": "light",
        // "address": "20 91 DD 1"
    // },
    // {
        // "name": "Kitchen Sink",
        // "parent": "29763",
        // "type": "light",
        // "address": "20 95 1D 1"
    // },
    // {
        // "name": "Patio",
        // "parent": "29763",
        // "type": "light",
        // "address": "20 A8 FC 1"
    // },
    // {
        // "name": "Dining Area",
        // "parent": "29763",
        // "type": "light",
        // "address": "20 AE 83 1"
    // },
    // {
        // "name": "Kitchen Under Cabinets",
        // "parent": "29763",
        // "type": "light",
        // "address": "20 B1 50 1"
    // },
    // {
        // "name": "Kitchen Light",
        // "parent": "29763",
        // "type": "light",
        // "address": "20 B2 AF 1"
    // }
// ];
