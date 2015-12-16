var parameters = arguments[0] || {};

Ti.API.debug("folders.js parameters:" + JSON.stringify(parameters));

/**
 * self-executing function to organize otherwise inline constructor code
 * @param  {Object} args arguments passed to the controller
 */
(function constructor(args) {
	$.foldersWin.title = parameters.viewName;
	if(OS_IOS) {
		$.navWin = parameters.navWin;
	}
})(parameters || {});


/**
 * event listener added via view for the refreshControl (iOS) or button (Android)
 * @param  {Object} e Event, unless it was called from the constructor
 */
function refresh(e) {
	'use strict';

	// if we were called from the constructor programmatically show the refresh animation
	if (OS_IOS && !e) {
		$.refreshControl.beginRefreshing();
	}

	/**
	 * callback for fetch, both success and error
	 * @param  {Object} e Event
	 */
	function afterFetch(col, res) {
        Ti.API.debug("Finished afterFetch in folders.js!!!!!");
		// for iOS end the refreshing animation
		if (OS_IOS) {
			$.refreshControl.endRefreshing();
		}
	}

	// let the collection fetch data from it's data source
	Alloy.Collections.Device.fetch({
		success: afterFetch,
		error: afterFetch
	});
}

/**
 * data event transform function for the ListView
 * @param  {Object} model
 */
function transform(model) {
	var o = model.toJSON();
	if($.editMode){
		o.template = "editTemplate";
	}
	return o;
}

/**
 * data event filter for the ListView
 * @param  {Object} collection
 */
function filter(collection) {
	return collection.where({
		type:"folder"
	});
}

/**
 * callback function that gets called after the addFolder view is closed so the folder is added.
 * @param  {Object} e Event
 */
function addFolderCallback(event) {
	if (event.success) {
		addFolder(event.content);
	} else {
		Ti.API.debug("No Folder Added");
	}
}

/**
 *  function that adds a folder model.
 * @param  {Object} e Event
 */
function addFolder(content) {
	Ti.API.debug(content);
	var guid = Ti.Platform.createUUID();
	var model = {
		"name" : content,
		"displayName" : content,
		"address" : guid,
		"type" : "folder"
	};
	Alloy.createModel('Device', model).save({}, {
		success : function(model, response) {
			Ti.API.debug('success: ' + model.toJSON());
		},
		error : function(e) {
			Ti.API.error('error: ' + e.message);
			alert('Error saving new name ' + e.message);
		}
	});
}

/**
 * Function to open a view to rename the folder.
 * @param  {Object} e Event
 */
function editFolderClicked(e) {
	Ti.API.debug("editFolderClicked function!!!");
	var item = e.section.getItemAt(e.itemIndex);

	var params = {
		parentController: $,
		item: item,
		callback: function (event) {
			win.close();
		}
	};

	if (OS_IOS) {
		params.navWin = $.navWin;
	}

	var win = Alloy.createController("settingsMenu/editFolder", params).getView();

	if (OS_IOS) {
		$.navWin.openWindow(win);
	} else {
		win.open(); //simply open the window on top for Android (and other platforms)
	}
}




/**
 * event listener set on view to open the devices view so devices can be added to the folder.
 * On android if in edit mode this will open the editView so the folder can be renamed.
 * @param  {Object} e Event
 */
function select(e) {
	Ti.API.debug("Select!!!");
	Ti.API.debug("e: " + JSON.stringify(e));
	'use strict';

	// lookup the model
	var model = Alloy.Collections.Device.get(e.itemId);

	// select event on this controller, passing the model with it
	// Open the edit folder view for android if in edit mode to rename the view.
	if(!OS_IOS && $.editMode) {
		editFolderClicked(e);
	} else {
		var params = {
			model: model
		};

		if (OS_IOS) {
			params.navWin = $.navWin;
		}

		//create the devices controller with the model and get its view
		var win = Alloy.createController('settingsMenu/devices', params).getView();

		//open the window in the NavigationWindow for iOS
		if (OS_IOS) {
			$.navWin.openWindow(win);
		} else {
			win.open();   //simply open the window on top for Android (and other platforms)
		}
	}
}

/**
 * event listener set via view for when the user clicks the delete or rename edit action buttons. iOS only.
 * @param  {Object} e Event
 */
function onEditactionClick (e) {
	Ti.API.debug("onEditactionClick e: " + JSON.stringify(e));
	$.editFolderBtn.title = "Edit";
	$.folderListView.setEditing(false);
	$.addFolderFab.showMe();
	if(e.action=="RENAME") {
		//openRenameFolder(e)
		editFolderClicked(e);

	} else if (e.action=="DELETE") {
		alert("You can't delete a folder yet");
	}
}

/**
 * event listener set via view for when the user clicks the edit button so they can move rename delete devices.
 * @param  {Object} e Event
 */

function editFolderBtnClicked(e) {
	Ti.API.debug("editFolderBtnClicked!!!");
	var btn = e.source;
	if(btn.title == "Edit") {
		btn.title = "Done";
		$.editMode = true;
		if(OS_IOS){
			Ti.API.debug("$.folderListView.setEditing(true);");

			$.folderListView.setEditing(true);
		} else {
			Ti.API.debug("updateUI");
			updateUI(); //We need to run updateUI so the new transform will work now that we are in editMode.
		}
		$.addFolderFab.hideMe();
	} else {
		btn.title = "Edit";
		$.editMode = false;
		if(OS_IOS) {
			Ti.API.debug("$.folderListView.setEditing(false);");

			$.folderListView.setEditing(false);
		} else {
			Ti.API.debug("updateUI");
			updateUI(); //We need to run updateUI so the new transform will work now that we are in editMode.
		}
		$.addFolderFab.showMe();
	}
}

/**
 * event listener set via view for when the user clicks the floating add button.
 */
$.addFolderFab.onClick(function(e) {
	Ti.API.debug("addFolderClicked");
	var win = Alloy.createController("settingsMenu/addFolder", {
		parentController: $,
		callback: function (event) {
			win.close();
			addFolderCallback(event);
		}
	}).getView();

	if (OS_IOS) {
		$.navWin.openWindow(win);
	} else {
		win.open(); //simply open the window on top for Android (and other platforms)
	}
});

/**
 * event listener to destroy all event listeners setup by Alloy.
 */
$.foldersWin.addEventListener("close", function(){
	$.destroy();
});


/**
 * event listener set via view to provide a search of the ListView.
 * @param  {Object} e Event
 */
$.sf.addEventListener('change',function(e){
	Ti.API.info("search change");
	$.folderListView.searchText = e.value;
});