var _args = arguments[0] || {}, // Any passed in arguments will fall into this property
	folders = null,  // Array placeholder for all folders
	indexes = [];  // Array placeholder for the ListView Index (used by iOS only);
	
/** 
 * Function to initialize the View, sets up the ListView
 */
function init() {
	//Get All of the devices and the folders they are in
	var deviceInFolderTable = Alloy.Collections.deviceInFolder.config.adapter.collection_name;
	var deviceInViewTable = Alloy.Collections.deviceInView.config.adapter.collection_name;
	var deviceTable = Alloy.Collections.device.config.adapter.collection_name;
	
	
	var sql = "SELECT " + deviceTable + ".id, " + deviceTable + ".name, " + deviceTable + ".displayName, " + deviceTable + ".address, " + deviceTable + ".type," +
		" " + deviceTable + ".parent, " + deviceInViewTable + ".DeviceId, " + deviceInViewTable + ".ViewId, " + deviceInFolderTable + ".folderAddress," + 
		" ifnull(" + deviceInViewTable + ".SortId,9999) as viewSortId" + 
		" FROM " + deviceTable + " LEFT JOIN " + deviceInFolderTable +" ON " + deviceInFolderTable + ".deviceAddress = "+ deviceTable +".address" +
		" LEFT JOIN " + deviceInViewTable + " ON " + deviceInViewTable + ".DeviceId = " + deviceTable + ".id AND ViewId=" + VIEW_ID_FAVORITES;
	
	Ti.API.debug("sql: " + sql);
	$.device.fetch({
		query:sql,
		success: function (data) {
			Ti.API.info("data: " + JSON.stringify(data));
			processDevicesInFolders(data.toJSON());
		},
		error: function () {
			Ti.API.debug("refreshDevicesInFolder Failed!!!");
		}
	});
}
	
function processDevicesInFolders(devicesAndFolders) {
	//Filter the folders themselves out of the list before grouping.
	var listOfFolders = [];
	var folders = _.filter(devicesAndFolders, function (folder) {
		if (folder.type == "folder") {
			listOfFolders.push(folder);
		} else {
			return folder.type != "folder";	
		}

	});
	
	 // Group the data by folder to make it easier to createsections. 
	folders  = _.groupBy(folders, function(item){
	 	return item.FolderAddress;
	});
	
	Ti.API.info("listOfFolders: " + JSON.stringify(listOfFolders));
	//folders are grouped by the folders address.  We need it to show the display name instead of the address so we'll replace it with that.
	var tempObj = {};
	_.each(folders, function(folder, i) {
		var f = _.findWhere(listOfFolders, {address:i});
		//If it's not in a folder don't display it.
		if(f) {
			tempObj[f.displayName] = folder;
		} 
	});
	folders=tempObj;
	Ti.API.info("folder after replacing names: " + JSON.stringify(folders));


	// /**
	 // * Sorts the `folders` array by the SortId (leverages UnderscoreJS _.sortBy function)
	 // */
	// folders = _.sortBy(folders, function(folder){
		// Ti.API.info("folderInSort: " + JSON.stringify(folder));
		// return folder.SortId
	// });
	


	if(folders) {
		/**
		 * Setup our Indexes and Sections Array for building out the ListView components
		 * 
		 */
		indexes = [];
		var sections = [];
		
        // /**
         // * Iterate through each folder and prepare the data for the ListView
         // * (Leverages the UnderscoreJS _.each function)
         // */
		_.each(folders, function(folder, i){
        	Ti.API.info("folder: " + JSON.stringify(folder));
        	Ti.API.info("i: " + JSON.stringify(i));
			/**
			 * Take the group data that is passed into the function, and parse/transform
			 * it for use in the ListView templates as defined in the folders.xml file.
			 */
			var dataToAdd = preprocessForListView(folder);
        	Ti.API.info("dataToAdd: " + JSON.stringify(dataToAdd));
			/**
			 * Check to make sure that there is data to add to the table,
			 * if not lets exit
			 */
			if(dataToAdd.length < 1) return;

			/**
			 * Lets take the name of the Folder and push it onto the index
			 * Array - this will be used to generate the indices for the ListView on IOS
			 */
			indexes.push({
				index: indexes.length,
				title: i
			});

			/**
			 * Create the ListViewSection header view
			 */

			 var sectionHeader = Ti.UI.createView();
			

			 /**
			  * Create and Add the Label to the ListView Section header view
			  */
			 var sectionLabel = Ti.UI.createLabel({
			 	text: i
			 });
			 
			 /**
			  * Add the correct style to the label dynamically.
			  */
			 var rowGroupStyle = $.createStyle({
			 	classes: 'groupLbl'
			 });
 			 sectionLabel.applyProperties(rowGroupStyle);
			 
			 sectionHeader.add(sectionLabel);

			/**
			 * Create a new ListViewSection, and ADD the header view created above to it.
			 */
			 var section = Ti.UI.createListSection({
				headerView: sectionHeader
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

		/**
		 * Add the ListViewSections and data elements created above to the ListView
		 */
		$.favoritesListView.sections = sections;
	}
}

/**
 *	Convert an array of data from a JSON format into a format that can be added to the ListView
 * 
 * 	@param {Object} Raw data elements from the JSON file.
 */
var preprocessForListView = function(rawData) {
	Ti.API.info("rawData: " + JSON.stringify(rawData));
	/**
	 * Using the rawData collection, we map data properties of the folders in this array to an array that maps an array to properly
	 * display the data in the ListView based on the templates defined in directory.xml (levearges the _.map Function of UnderscoreJS)
	 */
	return _.map(rawData, function(item) {
			Ti.API.info("item: " + JSON.stringify(item));
		/**
		 * Create the new device object which is added to the Array that is returned by the _.map function. 
		 */
		return {
			template: "lightTemplate",
			properties: {
				searchableText: item.displayName,
			    modelId:item.id,
				light: item,
			},
			btn: {title: item.displayName, address:item.address, type:item.type},
			slider: {value: item.sliderVal},
			sliderLbl: {text: item.sliderVal},
		};
	});	
};

/**
 * This function handles the click events for the rows in the ListView.
 * 
 * @param {Object} Event data passed to the function
 */
function onItemClick(e){
	/**
	 * Get the Item that was clicked
	 */
	var item = $.favoritesListView.sections[e.sectionIndex].items[e.itemIndex];
	
	// Alloy.Globals.Navigator.open("profile", item.properties.user);
}

/**
 * This code is only relevant to iOS - to make it cleaner, we are declaring variables, and
 * then assigning them to functions within an iOS Block. On Android, etc this code block will not
 * exist
 */
var onSearchChange, onSearchFocus, onSearchCancel;

/**
 * Handles the SearchBar OnChange event
 * 
 * @description On iOS we want the search bar to always be on top, so we use the onchange event to tie it back
 * 				to the ListView
 * 
 * @param {Object} Event data passed to the function
 */
onSearchChange = function onChange(e){
	$.favoritesListView.searchText = e.source.value;
};
	
if(OS_IOS){
	
	/**
	 * Updates the UI when the SearchBar gains focus. Shows
	 * the Cancel button.
	 * 
	 * @description show the Cancel button
	 * 
	 * @param {Object} Event data passed to the function
	 */
	onSearchFocus = function onFocus(e){
			$.searchBar.showCancel = true;
	};
	
	/**
	 * Updates the UI when the Cancel button is clicked within the search bar. Hides the Cancel button.
	 * 
	 * @param {Object} Event data passed to the function
	 */
	onSearchCancel = function onCancel(e){
		if(!_args.restrictToFavorites){
			$.searchBar.showCancel = false;
		}	
		$.searchBar.blur();
	};
	
	/**
	 * Updates user record favorite classification and the list elements
	 * 
	 *  @param {Object} e  Event data passed to the function
	 */
	function onRowAction(e){
		
		var row = e.section.getItemAt(e.itemIndex);
		var id = row.properties.user.id;
		
		init();
	}
}

/**
 * Hide Bookmark Icon (Android)
 */
$.wrapper.addEventListener("open", function onWindowOpen(){
	if(OS_ANDROID && _args.restrictToFavorites){
		
		var activity = $.wrapper.getActivity();
		activity.onCreateOptionsMenu = function(e) {
	 		e.menu.clear();
		};	
		activity.invalidateOptionsMenu();
	}
});

/**
 * Listen for the refresh event, and re-initialize
 */
Ti.App.addEventListener("refresh-data", function(e){
	init();
});


/**
 * Initialize View
 */
init();

