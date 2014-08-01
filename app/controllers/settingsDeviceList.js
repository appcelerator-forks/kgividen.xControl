var viewId = 1;

//This is used for adding the correct viewId to the model/collection for the table view.
function transformFunction(model) {
    var transform = model.toJSON();
    transform.viewId = viewId;
    return transform;
}

function addToView(deviceId, viewId) {
    var model = {
        "DeviceId" : deviceId,
        "ViewId" : viewId
    };
    Alloy.createModel('DeviceInView', model).save({silent: true});
}

function refreshDevices(){
    device.getListOfDevices().then(function (data) {

        _.each(data,function(item){
            //add all of the defaults if they aren't there for the model
            _.defaults(item,{displayName:item.name}, {parent:"unknown"}, {type:"unknown"});
        });

        //Add all of the new records in the collection that came from the hardware device.
        var devices = Alloy.Collections.device;  //Alloy.Collections.device is defined in alloy.js
        _.each(data, function (item) {
            //We only want to add new devices.
            var deviceArray = devices.where({address: item.address});  //get the model from the collection if it's already been added.
            if (!deviceArray[0]) {
                var deviceModel = Alloy.createModel('Device', item);
                deviceModel.save();

                //add them into their categories and one of them into the favorites.
                Ti.API.info("deviceModel.id: " + deviceModel.id + " deviceModel.type:" + deviceModel.get('type'));
                if(deviceModel.get('type') == "scene") {
                    addToView(deviceModel.id, VIEW_ID_SCENES);
                } else if (deviceModel.get('type') == "folder"){
                    addToView(deviceModel.id, VIEW_ID_LIGHTS);
                } else {
                    addToView(deviceModel.id, VIEW_ID_LIGHTS);  //add to lighting view
                }
            }
        });
        Alloy.Collections.deviceInView.fetch();
        devices.fetch();

        //If we've never populated the favorites before lets do it so there's some data in there for them to see.
        if(!Ti.App.Properties.getBool('isFavoritesPopulatedOnce')) {
            var devicesJSON = devices.toJSON();
            Ti.API.info("devicesJSON: " + JSON.stringify(devicesJSON));
            //Set the first of each to show up in the favorites view so it's not blank.
            var tempType = _.findWhere(devicesJSON, {type: "light"});
            Ti.API.info("tempType: " + JSON.stringify(tempType));
            if (typeof tempType != 'undefined') {
                addToView(tempType.id, VIEW_ID_FAVORITES);
            }

            tempType = _.findWhere(devicesJSON, {type: "folder"});
            if (typeof tempType != 'undefined') {
                addToView(tempType.id, VIEW_ID_FAVORITES);
            }

            tempType = _.findWhere(devicesJSON, {type: "scene"});
            if (typeof tempType != 'undefined') {
                addToView(tempType.id, VIEW_ID_FAVORITES);
            }
            Alloy.Collections.deviceInView.fetch();
            devices.fetch();
            Ti.App.Properties.setBool('isFavoritesPopulatedOnce', true);
        }
    });
}

//TODO refactor
function updateViewsSortOrder(viewName){
    var devices = Alloy.Collections.device;
    var i = 0;
    if($.devicesTableView.data[0]) {
        var deviceTvData = $.devicesTableView.data[0].rows;
        var viewSortId = viewId + "SortId";

        _.each(deviceTvData, function (d) {
            var model = devices.get(d.id);
            var obj = {};
            obj[viewSortId] = i;
            model.save(obj, {silent: true});
            i++;
        });
    }
}
//We have to pass in the data on Android because we are swapping the rows manually.
//function updateViewsSortOrderAndroid(viewId){
//    if($.devicesTableView.data[0]) {
//        var deviceTvData = $.devicesTableView.data[0].rows;
//        _.each(deviceTvData, function (d) {
//            var model = Alloy.Collections.device.get(d.alloy_id);
//            var sortId = parseInt(d.getChildren()[0].getChildren()[3].value);
//            Ti.API.info("sortId: " + sortId);
//            var viewSortId = viewId + "SortId";
//            Ti.API.info("viewSortId: " + viewSortId);
//
//            var obj = {};
//            obj[viewSortId] = sortId;
//            model.save(obj);
//        });
//    }
//}
//LISTENERS

$.closeBtn.addEventListener('click', function () {
//    if(osname == "android"){
//        updateViewsSortOrderAndroid(viewId);
//    }else{
//        updateViewsSortOrder(viewId);
//    }
    $.win.close();
});

$.win.addEventListener("close", function(){
    $.destroy();
    Ti.API.info("DESTROYING!!!!");
});

$.win.addEventListener("open", function(){
//    Alloy.Collections.device.sortByID("showInFavoritesViewSortId");
    refreshDevices();
    $.chooseViewBar.index = 0;
});

$.chooseViewBar.addEventListener("click", function(e){
    switch(e.index) {
        case 0:
//            updateViewsSortOrder(viewId);
            viewId = VIEW_ID_FAVORITES;
//            Alloy.Collections.device.sortByID(viewName + "SortId");
            updateUI();
            break;
        case 1:
//            updateViewsSortOrder(viewId);
            viewId = VIEW_ID_LIGHTS;
//            Alloy.Collections.device.sortByID(viewName + "SortId");
            updateUI();
            break;
        case 2:
//            updateViewsSortOrder(viewId);
            viewId = VIEW_ID_SCENES;
//            Alloy.Collections.device.sortByID(viewName + "SortId");
            updateUI();
            break;
        default:
//            updateViewsSortOrder(viewId);
            viewId = VIEW_ID_FAVORITES;
//            Alloy.Collections.device.sortByID(viewName + "SortId");
            updateUI(); //This calls the dataFunction in the view.
    }
});


//ANDROID MOVE ORDER OF ROWS IN TABLE VIEW CODE
$.devicesTableView.addEventListener('click', function(e) {

    data = $.devicesTableView.data[0].rows;
    var action = e.source.action,
        index = e.index,
        isFirstRow = index === 0,
        isLastRow = index + 1 === data.length;

    Ti.API.info("Clicked!!!!" + action);


    if(action === 'moveUp' && !isFirstRow) {
        swapRows(index, index - 1);
    } else if(action === 'moveDown' && !isLastRow) {
        swapRows(index, index + 1);
    }

});

function swapRows(indexOne, indexTwo) {
    Ti.API.info("swapRows");
    var temp = data[indexOne];
    data[indexOne] = data[indexTwo];
    data[indexTwo] = temp;
    $.devicesTableView.data = data;
}

//ANDROID MOVE ORDER OF ROWS IN TABLE VIEW CODE
//var data = [];
//$.devicesTableView.addEventListener('click', function(e) {
//    data = $.devicesTableView.data[0].rows;
//    var action = e.source.action,
//        index = e.index,
//        isFirstRow = index === 0,
//        isLastRow = index + 1 === data.length;
//    if(action === 'moveUp' && !isFirstRow) {
//        swapRows(index, index - 1);
//    } else if(action === 'moveDown' && !isLastRow) {
//        swapRows(index, index + 1);
//    }
//});
//
//function swapRows(indexOne, indexTwo) {
////    var temp = data[indexOne];
////    data[indexOne] = data[indexTwo];
////    data[indexTwo] = temp;
//    var i1SortId = data[indexOne].SortId;
//    var i2SortId = data[indexTwo].SortId;
//    var devices = Alloy.Collections.device;
//    var model = devices.get(data[indexOne].alloy_id);
//    var model2 = devices.get(data[indexTwo].alloy_id);
//
//    switch(viewName) {
//        case "showInFavoritesView":
//            model.save({showInFavoritesViewSortId: i2SortId});
//            model2.save({showInFavoritesViewSortId: i1SortId});
//            Alloy.Collections.device.sortByID("showInFavoritesViewSortId");
//            break;
//        case "showInLightingView":
//            model.save({showInLightingViewSortId: i2SortId});
//            model2.save({showInLightingViewSortId: i1SortId});
//            Alloy.Collections.device.sortByID("showInLightingViewSortId");
//            break;
//        case "showInScenesView":
//            model.save({showInScenesViewSortId: i2SortId});
//            model2.save({showInScenesViewSortId: i1SortId});
//            Alloy.Collections.device.sortByID("showInScenesViewSortId");
//            break;
//        default:
//            model.save({showInFavoritesViewSortId: i2SortId});
//            model2.save({showInFavoritesViewSortId: i1SortId});
//            Alloy.Collections.device.sortByID("showInFavoritesViewSortId");
//    }
//    updateUI();
//}


