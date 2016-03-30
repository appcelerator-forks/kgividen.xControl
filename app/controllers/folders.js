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
			processDevicesInFolders(data.toJSON(), VIEW_ID_FAVORITES);
			processDevicesInFolders(data.toJSON(), VIEW_ID_LIGHTS);
			processDevicesInFolders(data.toJSON(), VIEW_ID_SCENES);
			processDevicesInFolders(data.toJSON(), VIEW_ID_SENSORS);
			refresh();
		},
		error : function() {
			Ti.API.debug("refreshDevicesInFolder Failed!!!");
		}
	});
}

function processDevicesInFolders(devicesAndFolders, viewId) {
	/** Filter the folders themselves out of the list before grouping.
	 *filter out the ones that aren't for this viewId.
	 */
	var listOfFolders = [];
	var devices = _.filter(devicesAndFolders, function(folder) {
		if (folder.type == "folder" && folder.ViewId == viewId) {
			listOfFolders.push(folder);
		} else {
			return folder.type != "folder";
		}

	});
	
	//Group all the devices that are in the same Folder
	var devicesGrouped = _.groupBy(devices, 'FolderAddress');

	//Find the folder where the devices should be located and add the devices to that folder
	_.each(devicesGrouped, function(ds, i) {
		var f = _.findWhere(listOfFolders, {
			address : i
		});
		//If it's not in a folder don't display it.
		if (f) {
			f.devices = ds;
		}
	});

	//sort all the folders
	var folders = _.sortBy(listOfFolders, 'folderInViewSortId');

	//Sort the devices within the folder
	_.each(folders, function(folder) {
		folder.devices = _.sortBy(folder.devices, 'deviceInFolderSortId');
	});

	var sections = [];
	if (folders && folders.length > 0) {
		/**
		 * Setup our Indexes and Sections Array for building out the ListView components
		 *
		 */
		indexes = [];
		



		/**
		 * Iterate through each folder and prepare the data for the ListView
		 * (Leverages the UnderscoreJS _.each function)
		 */
		_.each(folders, function(folder, i) {
			/**
			 * Take the group data that is passed into the function, and parse/transform
			 * it for use in the ListView templates as defined in the folders.xml file.
			 */
			var dataToAdd = preprocessForListView(folder.devices);
			/**
			 * Check to make sure that there is data to add to the table,
			 * if not lets exit
			 */
			if (dataToAdd.length < 1)
				return;

			/**
			 * Lets take the name of the Folder and push it onto the index
			 * Array - this will be used to generate the indices for the ListView on IOS
			 */
			indexes.push({
				index : indexes.length,
				title : folder.displayName
			});

			/**
			 * Create the ListViewSection header view
			 */

			var sectionHeader = Ti.UI.createView();

			/**
			 * Create and Add the Label to the ListView Section header view
			 */
			var sectionLabel = Ti.UI.createLabel({
				text : folder.displayName
			});

			/**
			 * Add the correct style to the label dynamically.
			 */
			var rowGroupStyle = $.createStyle({
				classes : 'groupLbl'
			});
			sectionLabel.applyProperties(rowGroupStyle);

			sectionHeader.add(sectionLabel);

			/**
			 * Create a new ListViewSection, and ADD the header view created above to it.
			 */
			var section = Ti.UI.createListSection({
				headerView : sectionHeader
			});

			/**
			 * Add Data to the ListViewSection
			 */
			section.items = dataToAdd;

			/**
			 * Push the newly created ListViewSection onto the `sections` array. This will be used to populate
			 * the ListView
			 */
			sections.push(section);
		});

	} else {
			var sectionHeader = Ti.UI.createView();
			
			//There's gotta be a better place for this.
			if(viewId===VIEW_ID_FAVORITES){
				viewName = "Favorites";	
			} else if (viewId===VIEW_ID_LIGHTS){
				viewName = "Lights";	
			} else if (viewId==VIEW_ID_SCENES) {
				viewName = "Scenes";	
			} else if (viewId==VIEW_ID_SENSORS) {
				viewName = "Sensors";	
			}
			/**
			 * Create and Add the Label to the ListView Section header view
			 */
			var sectionLabel = Ti.UI.createLabel({
				text : "Add something to this " + viewName +" view by choosing Edit Mode in the right menu."
			});	
			
			var rowGroupStyle = $.createStyle({
				classes : 'infoLbl'
			});
			
			sectionLabel.applyProperties(rowGroupStyle);
			sectionHeader.add(sectionLabel);
			
			var section = Ti.UI.createListSection({
				headerView : sectionHeader
			});
			
			sections.push(section);
	}
	
		//There is probably a better way to do this instead of hardcoding the views
	if(viewId===VIEW_ID_FAVORITES){
		$.favoritesListView.sections = sections;	
	} else if (viewId===VIEW_ID_LIGHTS){
		$.lightsListView.sections = sections;	
	} else if (viewId==VIEW_ID_SCENES) {
		$.scenesListView.sections = sections;
	} else if (viewId==VIEW_ID_SENSORS) {
		$.sensorsListView.sections = sections;
	}
}

/**
 *	Convert an array of data from a JSON format into a format that can be added to the ListView
 *
 * 	@param {Object} Raw data elements from the JSON file.
 */
var preprocessForListView = function(rawData) {
	/**
	 * Using the rawData collection, we map data properties of the folders in this array to an array that maps an array to properly
	 * display the data in the ListView based on the templates defined (levearges the _.map Function of UnderscoreJS)
	 */
	return _.map(rawData, function(item) {
		/**
		 * Create the new device object which is added to the Array that is returned by the _.map function.
		 */
		if(item.type == "scene") {
			item.template = "sceneTemplate";	
		} else if (item.type == "sensor") {
			item.template = "sensorTemplate";
		} else if (item.type == "dimmer"){
			item.template = "dimmerTemplate";
		} else if (item.type == "switch"){
			item.template = "switchTemplate";
		} else if (item.type == "program"){
			item.template = "programTemplate";
		} else {
			item.template = "dimmerTemplate";
		}
		return {
			template : item.template,
			properties : {
				searchableText : item.displayName,
				modelId : item.id,
				light : item,
			},
			btn : {
				title : item.displayName,
				address : item.address,
				type : item.type
			},
			slider : {
				value : item.sliderVal
			},
			sliderLbl : {
				text : item.sliderVal
			},
			label: {
				text: item.displayName
			},
			switchLblStatus: {
				text:"checking..."
			},
			sceneBtnOn: {
				title:"On"
			},
			sceneBtnOff: {
				title:"Off"
			},
			sensorLblStatus: {
				text:"checking..."
			},
			sensorSwitch: {
				value:"off"
			}
		};
	});
};

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


//***************ON EVENTS CALLED FROM THE XML *********************
function btnClick(e){
    var item = e.section.items[e.itemIndex];
    var itemType = item.btn.type;
    var address = item.btn.address;


    if(!address){
        return;
    }
    Ti.API.info("address: " + address);
    if(itemType == "dimmer"){
        device.toggle(address)
            .then(refresh());
    } else if(itemType == "switch"){
        device.toggle(address)
            .then(refresh());
    }
}

function sendSliderVal(e) {
    Ti.API.debug("sendSliderVal");
    var item = e.section.getItemAt(e.itemIndex);
    Ti.API.debug("e: " + JSON.stringify(e));
    Ti.API.debug("address: " + JSON.stringify(item.btn.address));
    var itemType = e.bindId;
    var address = item.btn.address;


    if(address && itemType == "slider") {
        var level = Math.round(e.source.value);
        device.setLevel(address, level)
            .then(refresh());

        item.sliderLbl.text = level;  //Slider label
        item.slider.value = level;

        //TODO Android makes the slider jerky if you update it
        if(osname == "ios") {
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
    device.runProgram(address, "").then(refresh());;
}

function flashBtn(btn) {
	btn.setBackgroundGradient({});
	var animation = Titanium.UI.createAnimation();
	animation.backgroundColor = 'yellow';
	animation.duration = 500;
	var animationHandler = function() {
		animation.removeEventListener('complete', animationHandler);
		animation.backgroundColor = "transparent";
	 	btn.animate(animation, function(){
	 		btn.setBackgroundColor="#272b2c";
		  	btn.setBackgroundGradient({
		  		type: 'linear',	
		    	colors: [ { color: '#3b4b55', offset: 0.0 }, { color: '#2a353c', offset: 0.50}, { color: '#3b4b55', offset: 1.0 } ]
	 		});	
	 	});
	};
	animation.addEventListener('complete', animationHandler);
	btn.animate(animation);
}

function sceneOnBtn(e){
	Ti.API.info("SceneOnBtn!!");
	var btn = e.source;
    var item = e.section.items[e.itemIndex];
    var address = item.btn.address;
    Ti.API.info("address: " + address);
    Ti.API.info("btn: " + JSON.stringify(btn));
	flashBtn(btn);
    if(!address){
        return;
    }
    // device.sceneOn(address).then(refresh());
    // e.section.updateItemAt(e.itemIndex, item);
}

function sceneOffBtn(e){
    var item = e.section.items[e.itemIndex];
    var address = item.btn.address;

    if(!address){
        return;
    }
    device.sceneOff(address).then(refresh());;
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
    return device.getAllDevicesStatus().then(updateUI);
};

Ti.App.addEventListener('refresh_ui', function(e){
	loadData();
});

function turnBtnOn(item) {
	// Ti.API.info("turnOnBtn item: " + JSON.stringify(item));
	//todo: Get this hardcoded styling out of here tried applyProperties but that doesn't work here...
	if(Alloy.Globals.blueTheme){
		item.btn.backgroundColor='#31B3E7';	
	}else {
	    item.btn.backgroundColor="#272b2c";
	    item.btn.backgroundGradient = {};   
	    // item.btn.borderColor="#2b3032";
	    item.btn.borderColor="yellow";
	    item.btn.borderRadius="5";
		item.btn.borderWidth="1"; 
	}	
	
	return item;
}

function turnBtnOff(item) {
	if(Alloy.Globals.blueTheme){
		item.btn.backgroundColor='#6CC5CF';
	}else {
		item.btn.backgroundColor = null;	
		item.btn.backgroundImage = '';	
	    item.btn.backgroundGradient = {
		    type: 'linear',
		    colors: [ { color: '#3b4b55', offset: 0.0 }, { color: '#2a353c', offset: 0.50}, { color: '#3b4b55', offset: 1.0 } ]
	    };
	    item.btn.borderRadius="5";
		item.btn.borderWidth="1"; 
	    item.btn.borderColor = "#343a3c";
	}	
	
	return item;
}

function updateUI(nodesByAddressAndStatus){
	//Each view in the scrollableView i.e. favorites, lighting, etc.
    _.each($.scrollableView.getViews(), function(view){
        var viewSections = view.getSections();
        //We use viewSections[0] because we only have one section on each of the views.
        _.each(viewSections, function(section){
        	var items = (section) ? section.getItems() : null;
	        if (section && items){
	            _.each(items, function(item, index){
	            	if(!item.btn) {
	            		return;
	            	}
	            	
	            	var current = _.findWhere(nodesByAddressAndStatus, {address:item.btn.address});
                    if(!current) {
                    	return;
                    }
	                if (item.btn.type == "sensor") {
	                	item.sensorLblStatus.text = (current.formatted && current.formatted != " ") ? current.formatted : "unknown";
	                	item.sensorSwitch.value = (current.value > 0) ? true : false;
                	} else { // else if item.btn.type == "dimmer" || item.btn.type == "switch" or anything else
	                    if(current.level > 0){
	                    	item = turnBtnOn(item);
	                    } else {
	                    	item = turnBtnOff(item);
	                    }
						if (item.slider) {
		                    item.slider.value = item.sliderLbl.text = current.level;
		//                    viewSections[0].updateItemAt(index,item); //This would be great but it makes the refresh VERY slow.
						}
						// This is for switches to show a label instead of a slider.
						item.switchLblStatus.text = (current.formatted && current.formatted != " ") ? current.formatted : "unknown";
					}
            	});
       	 	}
        	section.setItems(items);	
        });
    });
	// for iOS end the refreshing animation
	if (OS_IOS) {
		//There should be a better way to do this rather than duplicate the control
		// but if the same one is added to multiple tableViews things crap out
		$.refreshControlFav.endRefreshing();
		$.refreshControlLight.endRefreshing();
		$.refreshControlScene.endRefreshing();
	}
}


/**
 * Initialize View
 */
init();