var viewName = "showInFavoritesView"

//This is used for adding the correct viewName to the model/collection for the table view.
function transformFunction(model) {
    var transform = model.toJSON();
    transform.viewName = viewName;
    return transform;
}

function refreshDevices(){
    device.getListOfDevices().then(function (data) {
        //TEMP Fake Data DEBUG
//        var data = [
//            {
//                "name": "Kitchen",
//                "address": "29763",
//                "type": "folder",
//                "sortId": 0
//            },
//            {
//                "name": "Backyard Floods",
//                "parent": "29763",
//                "type": "light",
//                "sortId": 1,
//                "address": "20 88 48 1"
//            },
//            {
//                "name": "Kitchen 3way",
//                "parent": "29763",
//                "type": "light",
//                "sortId": 2,
//                "address": "20 91 DD 1"
//            },
//            {
//                "name": "Kitchen Sink",
//                "parent": "29763",
//                "type": "light",
//                "sortId": 3,
//                "address": "20 95 1D 1"
//            }
//        ];
        var devices = Alloy.Collections.device;  //Alloy.Collections.device is defined in alloy.js

        _.each(data,function(item){
            //add all of the defaults if they aren't there for the model
            _.defaults(item,{id:item.address}, {displayName:item.name}, {parent:"unkown"}, {type:"unknown"});
            //add them into their categories and into the favorites.

            if(item.type == "scene") {
                item.showInScenesView = 1;
            } else if (item.type =="folder"){
                item.showInLightingView = 1;
            } else {
                item.showInLightingView = 1;
            }
        });

        //Set the first of each to show up in the favorites view so it's not blank.
        var tempType = _.findWhere(data, {type: "light"});
        if (typeof tempType !='undefined'){
            tempType.showInFavoritesView = 1;
        }

        tempType= _.findWhere(data, {type: "folder"});
        if (typeof tempType !='undefined'){
            tempType.showInFavoritesView = 1;
        }

        tempType = _.findWhere(data, {type: "scene"});
        if (typeof tempType !='undefined'){
            tempType.showInFavoritesView = 1;
        }

        //Add all of the new records in the collection that came from the hardware device.
        _.each(data, function (item) {
            //We only want to add new devices.
            var deviceArray = devices.where({address: item.address});  //get the model from the collection if it's already been added.
            if (!deviceArray[0]) {
                var deviceModel = Alloy.createModel('Device', item);
                deviceModel.save();
            }
        });
        devices.fetch();
    });
}

function updateViewsSortOrder(viewName){
    var devices = Alloy.Collections.device;
    var i = 0;
    if($.devicesTableView.data[0]) {
        var deviceTvData = $.devicesTableView.data[0].rows;
        Ti.API.info("deviceTvData: " + JSON.stringify(deviceTvData));

        _.each(deviceTvData, function (d) {
            var model = devices.get(d.alloy_id);
            switch(viewName) {
                case "showInFavoritesView":
                    model.save({favoritesSortId: i}, {silent: true});
                    break;
                case "showInLightingView":
                    model.save({lightingSortId: i}, {silent: true});
                    break;
                case "showInScenesView":
                    model.save({scenesSortId: i}, {silent: true});
                    break;
                default:
            }
            i++;
        });
    }
}
//We have to pass in the data on Android because we are swapping the rows manually.
function updateViewsSortOrderAndroid(viewName, deviceTvData){
    var i = 0;
    _.each(deviceTvData, function (d) {
        var model = Alloy.Collections.device.get(d.alloy_id);
        switch(viewName) {
            case "showInFavoritesView":
                model.save({favoritesSortId: i}, {silent: true});
                break;
            case "showInLightingView":
                model.save({lightingSortId: i}, {silent: true});
                break;
            case "showInScenesView":
                model.save({scenesSortId: i}, {silent: true});
                break;
            default:
        }
        i++;
    });
}
//LISTENERS

$.closeBtn.addEventListener('click', function () {
    updateViewsSortOrder(viewName);
    $.win.close();
});

$.win.addEventListener("close", function(){
    $.destroy();
    Ti.API.info("DESTROYING!!!!");
});

$.win.addEventListener("open", function(){
    Alloy.Collections.device.sortByID("favoritesSortId");
    refreshDevices();
    $.chooseViewBar.index = 0;
});

$.chooseViewBar.addEventListener("click", function(e){
    switch(e.index) {
        case 0:
            updateViewsSortOrder(viewName);
            viewName = "showInFavoritesView";
            Alloy.Collections.device.sortByID("favoritesSortId");
            break;
        case 1:
            updateViewsSortOrder(viewName);
            viewName = "showInLightingView";
            Alloy.Collections.device.sortByID("lightingSortId");
            updateUI();
            break;
        case 2:
            updateViewsSortOrder(viewName);
            viewName = "showInScenesView";
            Alloy.Collections.device.sortByID("scenesSortId");
            updateUI();
            break;
        default:
            updateViewsSortOrder(viewName);
            viewName = "showInFavoritesView";
            Alloy.Collections.device.sortByID("favoritesSortId");
            updateUI(); //This calls the dataFunction in the view.
    }
});

var data = [];


//ANDROID MOVE ORDER OF ROWS IN TABLE VIEW CODE
$.devicesTableView.addEventListener('click', function(e) {
    data = $.devicesTableView.data[0].rows;
    var action = e.source.action,
        index = e.index,
        isFirstRow = index === 0,
        isLastRow = index + 1 === data.length;
    if(action === 'moveUp' && !isFirstRow) {
        swapRows(index, index - 1);
    } else if(action === 'moveDown' && !isLastRow) {
        swapRows(index, index + 1);
    }
});

function swapRows(indexOne, indexTwo) {
    var temp = data[indexOne];
    data[indexOne] = data[indexTwo];
    data[indexTwo] = temp;
    updateViewsSortOrderAndroid(viewName, data);
    switch(viewName) {
        case "showInFavoritesView":
            Alloy.Collections.device.sortByID("favoritesSortId");
            break;
        case "showInLightingView":
            Alloy.Collections.device.sortByID("lightingSortId");
            break;
        case "showInScenesView":
            Alloy.Collections.device.sortByID("scenesSortId");
            break;
        default:
            Alloy.Collections.device.sortByID("favoritesSortId");
    }
    updateUI();
}


