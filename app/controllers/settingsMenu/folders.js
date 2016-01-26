var parameters = arguments[0] || {};

Ti.API.info("folders.js parameters:" + JSON.stringify(parameters));

/**
 * self-executing function to organize otherwise inline constructor code
 * @param  {Object} args arguments passed to the controller
 */
(function constructor(args) {
	$.foldersWin.title = args.viewName;
	if(OS_IOS) {
		$.navWin = args.navWin;
		Ti.API.info("$.navWin constructor: " + JSON.stringify($.navWin));
	}
})(parameters || {});


/**
 * event listener added via view for the refreshControl (iOS) or button (Android)
 * @param  {Object} e Event, unless it was called from the constructor
 */
function refresh(e) {
	'use strict';
	Ti.API.info("THIS IS IN THE REFRESH!!!");
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
	
	//Get All of the devices and the folders they are in
	var deviceInFolderTable = Alloy.Collections.deviceInFolder.config.adapter.collection_name;
	var folderInViewTable = Alloy.Collections.folderInView.config.adapter.collection_name;
	var deviceTable = Alloy.Collections.device.config.adapter.collection_name;
	
	var sql = "SELECT " + deviceTable + ".id, " + deviceTable + ".name, " + deviceTable + ".displayName, " + deviceTable + ".address, " + deviceTable + ".type," + 
			  deviceTable + ".parent, " + folderInViewTable + ".FolderAddress, " + folderInViewTable + ".ViewId, ifnull(" + folderInViewTable + ".SortId,9999) as SortId" +
			  " FROM " + deviceTable + 
			  " INNER JOIN " + folderInViewTable + " ON " + folderInViewTable + ".FolderAddress = " + deviceTable + ".address WHERE ViewId='" + parameters.viewId + " '";


	Ti.API.info("sql: " + sql); 
	Alloy.Collections.Device.fetch({
		query:sql,
		success: function (data) {
			Ti.API.info("data: " + JSON.stringify(data));
			afterFetch();
		},
		error: function () {
			Ti.API.debug("refreshDevicesInFolder Failed!!!");
		}
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
			Ti.API.debug('success adding folder: ' + model.toJSON());
			linkFolderToView(model.toJSON());
		},
		error : function(e) {
			Ti.API.error('error: ' + e.message);
			alert('Error saving new name ' + e.message);
		}
	});

}

function linkFolderToView (folder) {
	//link the folder to the view
	var model = {
		"FolderAddress" : folder.address,
        "ViewId" : parameters.viewId
	};
	Alloy.createModel('FolderInView', model).save({}, {
		success : function(model, response) {
			Ti.API.debug('Link Folder to View success: ' + model.toJSON());
		},
		error : function(e) {
			Ti.API.error('error: ' + e.message);
			alert('Error saving new name ' + e.message);
		}
	});
}

/**
 * Update the sort order of all the objects in the folder so they are consistent and not duplicated in the order.
 * @param
 */
function updateFolderSortOrder(){
	Ti.API.info("updateFolderSortOrder!!!!");
	Alloy.Collections.folderInView.fetch({
		success: function (data) {
			var viewId = parameters.viewId;
			var folderList = $.folderSection.getItems();
			var i = 0;
			_.each(folderList, function (folder) {
				// Ti.API.info("foldeR: " + JSON.stringify(folder));
				var folderAddress = folder.address.text;
				if(folderAddress) {
					//if folder is in the folderInView set it's sort order to i.
					var modelInView = data.where({FolderAddress: folderAddress, ViewId: viewId});
					//where returns an array but we just need the first one if it's there.
					if (modelInView.length > 0) {
						modelInView[0].save({"SortId": i}, {silent: true});
					}
					i++;
				}
			});
		},
		error: function () {}
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
			Ti.API.info("$.navWin: " + JSON.stringify($.navWin));
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