var args = arguments[0] || {}, // Any passed in arguments will fall into this property
    folders = null, // Array placeholder for all folders
    indexes = [];
// Array placeholder for the ListView Index (used by iOS only);

/**
 * Function to initialize the View, sets up the ListView
 */
var init = function () {
	//If we don't have a connection setup send them to the settings page.  When done then come back and run init again.
	if(device.init()){
		loadData();
	} else {
		//Device is not initialized because of a connection error.  Let's send them to the network settings page and then come back again
		var params = {
			"callback": init
		};
		Alloy.createController("settings", params).getView().open();	
		alert('Connection Error! Please check the connection information. No connection info set.');
	}
};

function loadData() {
	//set whether the view can scroll.  This is set in the options page.
	$.scrollableView.setScrollingEnabled(!Titanium.App.Properties.getInt("swipeViewDisabled"));
	
	//Get All of the devices and the folders they are in
	var deviceInFolderTable = Alloy.Collections.deviceInFolder.config.adapter.collection_name;
	var folderInViewTable = Alloy.Collections.folderInView.config.adapter.collection_name;
	var deviceTable = Alloy.Collections.device.config.adapter.collection_name;

	var sql = "SELECT " + deviceTable + ".id, " + deviceTable + ".name, " + deviceTable + ".displayName, " + deviceTable + ".address, " + deviceTable + ".type, " + 
		folderInViewTable + ".ViewId, " + folderInViewTable + ".SortId as folderInViewSortId, " +
		deviceInFolderTable + ".folderAddress, " + deviceInFolderTable + ".id, " + deviceInFolderTable + ".SortId as deviceInFolderSortId" + 
		" FROM " + deviceTable + 
		" LEFT JOIN " + deviceInFolderTable + 
		" ON " + deviceInFolderTable + ".deviceAddress = " + deviceTable + ".address" + 
		" LEFT JOIN " + folderInViewTable + 
		" ON " + folderInViewTable + ".FolderAddress = " + deviceTable + ".address";
	
	Alloy.Collections.device.fetch({
		query : sql,
		success : function(data) {
			//We set this collection up so we can modify only the status in the setStatus
			Alloy.Collections.devicesAndStatus.reset(processDevicesInFolders(data.toJSON()),{silent: true});
			setStatus();
		},
		error : function() {
			Ti.API.debug("refreshDevicesInFolder Failed!!!");
		}
	});
}

//Data events
/**
 * data event transform function for the ListView
 * @param  {Object} model
 */
function transform(model) {
	var transform = model.toJSON();

	transform.template="dimmerOffTemplate";
	
	if(transform.type == "dimmer" && transform.value > 0) {
		transform.template="dimmerOnTemplate";
	}
	
	if(transform.type == "switch") {
	 	if(transform.value > 0) {
			transform.template="switchOnTemplate";
		} else {
			transform.template="switchOffTemplate";
		}
	}
	
	if(transform.type=="folder"){
		transform.template="groupLblTemplate";	
	}
	
	if(transform.type=="sensor"){
		transform.value = (transform.formatted == "On") ? true : false;
		transform.template="sensorTemplate";	
	}
	
	if(transform.type=="scene"){
		transform.template="sceneTemplate";	
	}
	
	if(transform.type=="program"){
		transform.template="programTemplate";	
	}

	return transform;
}

function favFilter(collection) {
	return collection.where({ViewId:VIEW_ID_FAVORITES});
}
function lightsFilter(collection) {
	return collection.where({ViewId:VIEW_ID_LIGHTS});
}
function scenesFilter(collection) {
	return collection.where({ViewId:VIEW_ID_SCENES});
}
function sensorsFilter(collection) {
	return collection.where({ViewId:VIEW_ID_SENSORS});
}

function processDevicesInFolders(devicesAndFolders){
	var devices = _.filter(devicesAndFolders, function(d){
		return d.type != "folder";
	});
	var listOfFolders = _.where(devicesAndFolders, {type:"folder"});
	
	//Group all the devices that are in the same Folder
	var devicesGrouped = _.groupBy(devices, 'FolderAddress');

	//Find the folder where the devices should be located and add the devices to that folder
	_.each(devicesGrouped, function(ds, i) {
		var foldersFound = _.where(listOfFolders, {
			address : i
		});
		_.each(foldersFound, function(f) {
			//If it's not in a folder don't display it.
			//We need to clone this because we set the ViewId lower and if we have the same devices in multiple folders 
			//in multiple views then the viewId has to be unique
			var devicesCloned = [];
			_.each(ds, function(d) {
				devicesCloned.push(_.clone(d));	
			});
			f.devices = devicesCloned;
		});
	});

	//sort all the folders
	var folders = _.sortBy(listOfFolders, 'folderInViewSortId');

	//Sort the devices within the folder
	_.each(folders, function(folder) {
		folder.devices = _.sortBy(folder.devices, 'deviceInFolderSortId');
	});
	
	var flattened = [];
	
	//Now flatten out the devices so they can be in the listView
	_.each(folders, function(folder) {
		flattened.push(folder);
		_.each(folder.devices, function(d) {
			d.ViewId = folder.ViewId;
			flattened.push(d);
		});
	});
	
	//Now that we're flattened let's get rid of the devices under the folder
	_.each(flattened, function(item) {
		if(item.devices) delete item.devices;
	});
	
	//filter out everything that's not on a view so we don't have to iterate through it.
	flattened = _.filter(flattened, function(item){
		return item.ViewId != null;
	});
	
	//get rid of the ids since we have some duplicate ones so the listview will load correctly
	flattened = _.map(flattened, function(o) { return _.omit(o, 'id'); });
	
	return flattened;	
}

/**
 * event listener set via view to provide a search of the ListView.
 * @param  {Object} e Event
 */

$.sfLights.addEventListener('change',function(e){
	$.lightsListView.searchText = e.value;
});

$.sfScenes.addEventListener('change',function(e){
	$.scenesListView.searchText = e.value;
});

$.sfSensors.addEventListener('change',function(e){
	$.sensorsListView.searchText = e.value;
});

//***************ON EVENTS CALLED FROM THE XML *********************
function btnClick(e){
    var item = e.section.items[e.itemIndex];
    var itemType = item.btn.type;
    var address = item.btn.address;

    if(!address){
        return;
    }
    if(itemType == "dimmer" || itemType =="switch"){
    	device.toggle(address, refresh);
    }
}

function sendSliderVal(e) {
    var item = e.section.getItemAt(e.itemIndex);
    Ti.API.debug("e: " + JSON.stringify(e));
    Ti.API.debug("address: " + JSON.stringify(item.btn.address));
    var itemType = e.bindId;
    var address = item.btn.address;


    if(address && itemType == "slider") {
        var level = Math.round(e.source.value);
        device.setLevel(address, level, refresh);
        item.sliderLbl.text = level;  //Slider label
        item.slider.value = level;

        //TODO Android makes the slider jerky if you update it
        if(OS_IOS) {
            e.section.updateItemAt(e.itemIndex, item);  //update the GUI
        }
    }
}

function programBtnClick(e){
    var item = e.section.items[e.itemIndex];
    var itemType = item.btn.type;
    var address = item.btn.address;


    if(!address){
        return;
    }
    flashBtn(e);
    device.runProgram(address, "", refresh);
}

function flashBtn(e) {
	//e.source doesn't work for android but does for iOS.
	//But applyProperties doesn't work for android so we will branch 
	//the code here since we want to abstract the styles as much as possible
	if(OS_IOS) {	    
		var styleOn = $.createStyle({
			classes : 'sceneOn'
		});
		var styleOff = $.createStyle({
			classes : 'sceneOff'
		});
		e.source.applyProperties(styleOn);
		setTimeout(function(){e.source.applyProperties(styleOff);}, 500);	
	} else {
    	var item = e.section.items[e.itemIndex];
	    item[e.bindId].borderColor = "yellow";
		e.section.updateItemAt(e.itemIndex, item);
		
		setTimeout(function(){
			item[e.bindId].borderColor = "#2b3032";
			e.section.updateItemAt(e.itemIndex, item);
			}, 500);	
	}
}

function sceneOnBtn(e){
    var item = e.section.items[e.itemIndex];
    var address = item.btn.address;
    // item.sceneBtnOn.borderColor = "yellow";
    e.section.updateItemAt(e.itemIndex, item);
	flashBtn(e);
    if(!address){
        return;
    }
    device.sceneOn(address, refresh);
}

function sceneOffBtn(e){
    var item = e.section.items[e.itemIndex];
    var address = item.btn.address;
	flashBtn(e);
    if(!address){
        return;
    }
    device.sceneOff(address, refresh);
}

// function updateSliderLbl(e) {
// //    Ti.API.debug("updateSliderLbl");
    // var level = Math.round(e.source.value);
    // var item = e.section.getItemAt(e.itemIndex);
// //    Ti.API.debug("level: " + level);
// 
    // item.sliderLbl.text = level;  //Slider label
    // //This needs to be done to update the sliderLBL but for now it doesn't work right because this conflicts with the update status
    // //TODO Android makes the slider jerky if you update it
    // if(osname == "ios") {
        // e.section.updateItemAt(e.itemIndex, item);  //update the GUI
    // }
// 
// }
//
var refresh = function (){
    setStatus();
};

exports.reloadData = function (){
	loadData();
};

exports.refreshStatus = function () {
	setStatus();
};

//This is used to update the data models behind the ListViews
function refreshListViewUI(){
	updateFavListView();
	updateLightsListView();	
	updateScenesListView();	
	updateSensorsListView();
}

function setStatus(){
	var b = Alloy.Collections.devicesAndStatus;
	
	var connection = device.getConnection();
	Alloy.Collections.isyStatus.fetch({
		"url": connection.baseURL + "status",
		headers: connection.headers,
		success : function(data) {
			data.each(function(d){
				var models = b.where({address: d.id});
				//This sets the status for each individual model.
				_.each(models, function(m) {
					// //TODO this should be in the isyStatus.js model but it isn't working
					var value = Math.round(d.get("property").value / 255 * 100);
					m.set("value", value, {silent: true});
					m.set("formatted", d.get("property").formatted,{silent: true});
					m.set("uom", d.get("property").uom,{silent: true});
				});
			});
			refreshListViewUI();
			// for iOS end the refreshing animation
			if (OS_IOS) {
				$.refreshControlFav.endRefreshing();
				$.refreshControlLight.endRefreshing();
				$.refreshControlScene.endRefreshing();
				$.refreshControlSensor.endRefreshing();
			}
		},
		error : function() {
			alert("Getting devices failed.  Please check the network settings.");
		}
	});
}

/**
 * Initialize View
 */
init();