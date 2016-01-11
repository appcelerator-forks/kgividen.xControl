var _args = arguments[0] || {}, // Any passed in arguments will fall into this property
	folders = null,  // Array placeholder for all folders
	indexes = [];  // Array placeholder for the ListView Index (used by iOS only);
	
/** 
 * Function to inialize the View, sets up the ListView
 */
function init(){
	// $.device.getSortedFoldersInView(VIEW_ID_FAVORITES);
	$.device.getDevicesByFolderAndViewAndSort(VIEW_ID_FAVORITES);
	// $.device.whereShow();
	var folders = $.device.toJSON();
	Ti.API.info("folders: " + JSON.stringify(folders));
	
	/**
	 * Group the data by first letter of last name to make it easier to create 
	 * sections. (leverages the UndrescoreJS _.groupBy function)
	 */
	var folderGroups  = _.groupBy(folders, function(item){
	 	return item.FolderAddress;
	});
	Ti.API.info("folderGroups: " + JSON.stringify(folderGroups));
	
	
	//TODO Iterate through the folders and add all the devices to the folders that are needed.
	// folders[0].devices = [
			// {
				// displayName: "Device1"
			// },
			// {
				// displayName: "Device2"
			// }];
			
	// folders[1].devices = [
			// {
				// displayName: "Device3"
			// },
			// {
				// displayName: "Device4"
			// }];
	
	/**
	 * Sorts the `folders` array by the SortId (leverages UnderscoreJS _.sortBy function)
	 */
	folders = _.sortBy(folders, function(folder){
		Ti.API.info("folder: " + JSON.stringify(folder));
		return folder.SortId
	});
	
	/**
	 * IF the folders array exists
	 */
	if(folders) {
		
		/**
		 * Setup our Indexes and Sections Array for building out the ListView components
		 * 
		 */
		indexes = [];
		var sections = [];
		
		/**
		 * Group the data by first letter of last name to make it easier to create 
		 * sections. (leverages the UndrescoreJS _.groupBy function)
		 */
		// var folderGroups  = _.groupBy(folders, function(item){
		 	// return item.name.charAt(0);
		// });
        
        // Ti.API.info("folderGroups: " + JSON.stringify(folderGroups));
        /**
         * Iterate through each folder and prepare the data for the ListView
         * (Leverages the UnderscoreJS _.each function)
         */
		_.each(folders, function(folder){
        	Ti.API.info("folder: " + JSON.stringify(folder));
			/**
			 * Take the group data that is passed into the function, and parse/transform
			 * it for use in the ListView templates as defined in the folders.xml file.
			 */
			var dataToAdd = preprocessForListView(folder.devices);
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
				title: folder.name
			});

			/**
			 * Create the ListViewSection header view
			 */

			 var sectionHeader = Ti.UI.createView({
			 	// class:"groupLbl"
			 });
			

			 /**
			  * Create and Add the Label to the ListView Section header view
			  */
			 var sectionLabel = Ti.UI.createLabel({
			 	text: folder.name
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
};

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

