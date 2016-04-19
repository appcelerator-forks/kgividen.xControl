var parameters = arguments[0] || {};
var folderFabsAreShown = false;
/**
 * self-executing function to organize otherwise inline constructor code
 * @param  {Object} args arguments passed to the controller
 */
(function constructor(args) {
	$.foldersWin.title = args.viewName;
	if(OS_IOS) {
		$.navWin = args.navWin;
	}
})(parameters || {});

/**
 * event listener added via view for the refreshControl (iOS) or button (Android)
 * @param  {Object} e Event, unless it was called from the constructor
 */
function refresh(e) {
	hideFolderFabs();
	'use strict';
	// if we were called from the constructor programmatically show the refresh animation
	if (OS_IOS && !e) {
		$.refreshControl.beginRefreshing();
	}

	//Get All of the devices and the folders they are in
	var deviceInFolderTable = Alloy.Collections.deviceInFolder.config.adapter.collection_name;
	var folderInViewTable = Alloy.Collections.folderInView.config.adapter.collection_name;
	var deviceTable = Alloy.Collections.device.config.adapter.collection_name;
	
	var sql = "SELECT " + deviceTable + ".id, " + deviceTable + ".name, " + deviceTable + ".displayName, " + deviceTable + ".address, " + deviceTable + ".type," + 
			  deviceTable + ".parent, " + folderInViewTable + ".FolderAddress, " + folderInViewTable + ".ViewId, ifnull(" + folderInViewTable + ".SortId,9999) as SortId" +
			  " FROM " + deviceTable + 
			  " INNER JOIN " + folderInViewTable + " ON " + folderInViewTable + ".FolderAddress = " + deviceTable + ".address WHERE ViewId='" + parameters.viewId + "' ORDER BY SortId";


	Alloy.Collections.device.fetch({
		query:sql,
		success: function (data) {
			// for iOS end the refreshing animation
			if (OS_IOS) {
				$.refreshControl.endRefreshing();
			}
			//display help if there aren't any items in the view
			(data.length < 1) ? $.helpMsg.show() : $.helpMsg.hide();
			updateFoldersUI();
			
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
	if($.isInEditingMode){
		o.template = "editTemplate";
	} else {
		o.template = "template";
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
 *  function that adds a folder model.
 * @param  {Object} e Event
 */
function addFolder(content) {
	
	if(!content){
		return;
	}

	if(!content.address) {
		content.address = Ti.Platform.createUUID();	
	}
	
	var model = {
		"name" : content.name,
		"displayName" : content.displayName,
		"address" : content.address,
		"type" : "folder"
	};
	
	Alloy.createModel('Device', model).save({}, {
		success : function(model, response) {
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
	Alloy.Collections.folderInView.fetch({
		success: function (data) {
			var viewId = parameters.viewId;
			var folderList = $.folderSection.getItems();
			var i = 0;
			_.each(folderList, function (folder) {
				if(folder.address){
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
	var item = e.section.getItemAt(e.itemIndex);
	var params = {
		parentController: $,
		item: item,
		callback: function (event) {
			win.close();
			refresh();
		}
	};
	var win = Alloy.createController("settingsMenu/editFolder", params).getView();

	if (OS_IOS) {
		params.navWin = $.navWin;
	}

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
	'use strict';

	// lookup the model
	var model = Alloy.Collections.device.get(e.itemId);

	// select event on this controller, passing the model with it
	// Open the edit folder view for android if in edit mode to rename the view.
	if(!OS_IOS && $.isInEditingMode) {
		return;
	} 

	var params = {
		model: model,
		callback: function (event) {
			win.close();
			refresh();
		}
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

/**
 * event listener set via view for when the user clicks the edit button.
 * It then reacts to the RENAME or DELETE.  IOS only
 * @param  {Object} e Event
 */
if (OS_IOS) {
	function onEditactionClick (e) {
		$.editFolderBtn.title = "Edit";
		$.folderListView.setEditing(false);
		$.toggleFolderFabs.showMe();
		if(e.action=="RENAME") {
			//openRenameFolder(e)
			editFolderClicked(e);
	
		} else if (e.action=="DELETE") {
			deleteFolder(e);
		}
	}
} else {
	/**
	 * event listener set via view for when the user clicks the delete button.  AndroidOnly
	 * @param  {Object} e Event
	 */
	//ios can swipe to delete so we don't need to do this
	function deleteBtnClick(e){
		deleteFolder(e);

	}
}

function closeWin(){
	$.destroy();
	$.foldersWin.close();
}

function deleteFolder(e) {
	var item = e.section.getItemAt(e.itemIndex);
	var dialog = Ti.UI.createAlertDialog({
		title: 'Are you sure you want to remove this folder?',
		buttonNames: ['Yes', 'No']
	});

	dialog.addEventListener('click', function (e) {
		if (e.index == 0) {
			deleteItem(item);
		}
	});
	dialog.show();
}

/**
 * Delete function to delete the model from the collection.
 * @param  {Object} item
 */
function deleteItem(item){
	var viewId = parameters.viewId;
	var folderAddress = item.address.text;

	Alloy.Collections.folderInView.fetch({
		success: function (data) {
			var foldersToDelete = data.where({"FolderAddress":folderAddress, "ViewId":viewId});
			_.each(foldersToDelete, function(folder){
				folder.destroy();	
			}); 
			if(!OS_IOS){ //android isn't refreshing on it's own.
				refresh();
			}			
		},
		error: function () {
			Ti.API.debug("delete Failed!!!");
		}
	});
}
/**
 * event listener set via view for when the user clicks the move up button.   Android Only
 * @param  {Object} e Event
 */
function moveUp(e){
	//Get the item we clicked on.
	var item = e.section.getItemAt(e.itemIndex);

	//Get the item above the item we clicked on
	var itemAbove = e.section.getItemAt(e.itemIndex - 1);
	if(!itemAbove){  //first one in the list
		return;
	}

	var folderAddress = item.address.text;
	var addressAbove = itemAbove.address.text;
	Alloy.Collections.folderInView.fetch({
		success: function (data) {
			var folderInView = data.where({ViewId: parameters.viewId, FolderAddress: folderAddress});

			var folderInViewAbove = data.where({ViewId: parameters.viewId, FolderAddress: addressAbove});

			//where returns an array but we just need the first one if it's there.
			if (folderInView.length > 0) {
				var newIndex = e.itemIndex - 1;
				folderInView[0].save({"SortId": newIndex}, {silent: true});
				folderInViewAbove[0].save({"SortId": e.itemIndex}, {silent: true});
			}
			refresh();
		},
		error: function () {
		}
	});
}


/**
 * event listener set via view for when the user clicks the move down button.   Android Only
 * @param  {Object} e Event
 */
function moveDown(e){
	var item = e.section.getItemAt(e.itemIndex);
	//Get the item below the item we clicked on

	var itemBelow = e.section.getItemAt(e.itemIndex + 1);
	if(!itemBelow){  //last one in the list
		return;
	}

	var folderAddress = item.address.text;
	var addressBelow = itemBelow.address.text;
	Alloy.Collections.folderInView.fetch({
		success: function (data) {

			var folderInView = data.where({ViewId: parameters.viewId, FolderAddress: folderAddress});
			var folderInViewBelow = data.where({ViewId: parameters.viewId, FolderAddress: addressBelow});
			
			//where returns an array but we just need the first one if it's there.
			if (folderInView.length > 0) {
				var newIndex = e.itemIndex + 1;
				folderInView[0].save({"SortId": newIndex}, {silent: true});
				folderInViewBelow[0].save({"SortId": e.itemIndex}, {silent: true});
			}

			refresh();
		},
		error: function () {
		}
	});
}


/**
 * event listener set via view for when the user clicks the edit button so they can move rename delete devices.
 * @param  {Object} e Event
 */

function editMenuBtnClicked(e) {
	var btn = e.source;
	if(!$.isInEditingMode) {
		btn.title = "Done";
		$.isInEditingMode = true;
		if(OS_IOS){
			$.folderListView.setEditing(true);
		} else {
			updateFoldersUI(); //We need to run updateFoldersUI so the new transform will work now that we are in editMode.
		}
		$.toggleFolderFabs.hideMe();
		hideFolderFabs();
	} else {
		btn.title = "Edit";
		$.isInEditingMode = false;
		if(OS_IOS) {
			$.folderListView.setEditing(false);
		} else {
			updateFoldersUI(); //We need to run updateFoldersUI so the new transform will work now that we are in editMode.
		}
		$.toggleFolderFabs.showMe();
	}
}

function showFolderFabs() {
	$.addFolderFab.showMe();
	$.addExistingFolderFab.showMe();
	$.toggleFolderFabs.applyProperties({left: "25%"});
	folderFabsAreShown = true;
}

function hideFolderFabs() {
	$.addFolderFab.hideMe();
	$.addExistingFolderFab.hideMe();
	$.toggleFolderFabs.applyProperties({left: "45%"});
	folderFabsAreShown = false;
}

/**
 * event listener set via view for when the user clicks the floating add button.
 */
$.toggleFolderFabs.onClick(function(e) {
	if(folderFabsAreShown){
		hideFolderFabs();
	} else {
		showFolderFabs();
	}
	
});

/**
 * event listener set via view for when the user clicks the floating add button.
 */
$.addFolderFab.onClick(function(e) {
	var win = Alloy.createController("settingsMenu/addFolder", {
		callback: function (event) {
			win.close();
			if (event.success) {
				addFolder(event.content);
			} else {
				Ti.API.debug("No Folder Added");
			}
			refresh();
		}
	}).getView();

	if (OS_IOS) {
		$.navWin.openWindow(win);
	} else {
		win.open(); //simply open the window on top for Android (and other platforms)
	}
});

/**
 * event listener set via view for when the user clicks the floating add existing folder button.
 */
$.addExistingFolderFab.onClick(function(){
	var win = Alloy.createController("settingsMenu/addExistingFolder", {
		callback: function (event) {
			win.close();
			if (event.success && event.content) {
				linkFolderToView(event.content);
			} else {
				Ti.API.debug("No Folder Added");
			}
			refresh();
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
	updateFolderSortOrder();
	$.destroy();
});


/**
 * event listener set via view to provide a search of the ListView.
 * @param  {Object} e Event
 */
$.sf.addEventListener('change',function(e){
	$.folderListView.searchText = e.value;
});

refresh();
