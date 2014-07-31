var viewName = "showInFavoritesView";

//This is used for adding the correct viewName to the model/collection for the table view.
function transformFunction(model) {
    var transform = model.toJSON();
    transform.showInViewName = viewName;
    return transform;
}

function refreshDevices(){
    device.getListOfDevices().then(function (data) {
        //TEMP Fake Data DEBUG
//deviceRowSortId
        var devices = Alloy.Collections.device;  //Alloy.Collections.device is defined in alloy.js

        _.each(data,function(item){
            //add all of the defaults if they aren't there for the model
            _.defaults(item,{id:item.address}, {displayName:item.name}, {parent:"unknown"}, {type:"unknown"});
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
        var viewSortId = viewName + "SortId";

        _.each(deviceTvData, function (d) {
            var model = devices.get(d.alloy_id);
            var obj = {};
            obj[viewSortId] = i;
            model.save(obj, {silent: true});
            i++;
        });
    }
}
//We have to pass in the data on Android because we are swapping the rows manually.
//function updateViewsSortOrderAndroid(viewName){
//    if($.devicesTableView.data[0]) {
//        var deviceTvData = $.devicesTableView.data[0].rows;
//        _.each(deviceTvData, function (d) {
//            var model = Alloy.Collections.device.get(d.alloy_id);
//            var sortId = parseInt(d.getChildren()[0].getChildren()[3].value);
//            Ti.API.info("sortId: " + sortId);
//            var viewSortId = viewName + "SortId";
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
//        updateViewsSortOrderAndroid(viewName);
//    }else{
        updateViewsSortOrder(viewName);
//    }
    $.win.close();
});

$.win.addEventListener("close", function(){
    $.destroy();
    Ti.API.info("DESTROYING!!!!");
});

$.win.addEventListener("open", function(){
    Alloy.Collections.device.sortByID("showInFavoritesViewSortId");
    refreshDevices();
    $.chooseViewBar.index = 0;
});

$.chooseViewBar.addEventListener("click", function(e){
    switch(e.index) {
        case 0:
            updateViewsSortOrder(viewName);
            viewName = "showInFavoritesView";
            Alloy.Collections.device.sortByID(viewName + "SortId");
            break;
        case 1:
            updateViewsSortOrder(viewName);
            viewName = "showInLightingView";
            Alloy.Collections.device.sortByID(viewName + "SortId");
            updateUI();
            break;
        case 2:
            updateViewsSortOrder(viewName);
            viewName = "showInScenesView";
            Alloy.Collections.device.sortByID(viewName + "SortId");
            updateUI();
            break;
        default:
            updateViewsSortOrder(viewName);
            viewName = "showInFavoritesView";
            Alloy.Collections.device.sortByID(viewName + "SortId");
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


