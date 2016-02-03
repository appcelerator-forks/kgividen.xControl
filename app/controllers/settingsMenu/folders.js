var parameters = arguments[0] || {};

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


function checkAndDisplayHelp(){
	Ti.API.info("items count: " + $.folderListView.getSections()[0].getItems().length);
	var itemsCount = 0;
	if($.folderListView.getSections()[0]) {
		itemsCount = $.folderListView.getSections()[0].getItems().length;
	}
	(itemsCount < 1) ? $.helpMsg.show() : $.helpMsg.hide();
}
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

	//Get All of the devices and the folders they are in
	var deviceInFolderTable = Alloy.Collections.deviceInFolder.config.adapter.collection_name;
	var folderInViewTable = Alloy.Collections.folderInView.config.adapter.collection_name;
	var deviceTable = Alloy.Collections.device.config.adapter.collection_name;
	
	var sql = "SELECT " + deviceTable + ".id, " + deviceTable + ".name, " + deviceTable + ".displayName, " + deviceTable + ".address, " + deviceTable + ".type," + 
			  deviceTable + ".parent, " + folderInViewTable + ".FolderAddress, " + folderInViewTable + ".ViewId, ifnull(" + folderInViewTable + ".SortId,9999) as SortId" +
			  " FROM " + deviceTable + 
			  " INNER JOIN " + folderInViewTable + " ON " + folderInViewTable + ".FolderAddress = " + deviceTable + ".address WHERE ViewId='" + parameters.viewId + "' ORDER BY SortId";


	Ti.API.info("sql: " + sql); 
	Alloy.Collections.Device.fetch({
		query:sql,
		success: function (data) {
			Ti.API.info("data in settings folders: " + JSON.stringify(data) );
			// for iOS end the refreshing animation
			if (OS_IOS) {
				$.refreshControl.endRefreshing();
			}
			checkAndDisplayHelp();
			
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
		Ti.API.info("Tansforming");
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
	var model = Alloy.Collections.Device.get(e.itemId);

	// select event on this controller, passing the model with it
	// Open the edit folder view for android if in edit mode to rename the view.
	if(!OS_IOS && $.isInEditingMode) {
		return;
	} 

	var params = {
		model: model,
		callback: function (event) {
			win.close();
		}
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

/**
 * event listener set via view for when the user clicks the edit button.
 * It then reacts to the RENAME or DELETE.  IOS only
 * @param  {Object} e Event
 */
if (OS_IOS) {
	function onEditactionClick (e) {
		Ti.API.debug("onEditactionClick e: " + JSON.stringify(e));
		$.editFolderBtn.title = "Edit";
		$.folderListView.setEditing(false);
		$.addFolderFab.showMe();
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
	$.foldersWin.close();
}

function deleteFolder(e) {
	// alert("You can't delete a folder yet");	
	Ti.API.info("e" + JSON.stringify(e));
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
			_.each(foldersToDelete, function(folder ){
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
	Ti.API.info("item : " + JSON.stringify(item));

	//Get the item above the item we clicked on
	var itemAbove = e.section.getItemAt(e.itemIndex - 1);
	Ti.API.info("itemAbove : " + JSON.stringify(itemAbove));
	if(!itemAbove){  //first one in the list
		return;
	}

	var folderAddress = item.address.text;
	var addressAbove = itemAbove.address.text;
	Ti.API.info("folderAddress : " + folderAddress + "addressAbove: " + addressAbove);
	Alloy.Collections.folderInView.fetch({
		success: function (data) {
			Ti.API.info("folderInView data: " + JSON.stringify(data));
			var folderInView = data.where({ViewId: parameters.viewId, FolderAddress: folderAddress});
			Ti.API.info("folderInView : " + JSON.stringify(folderInView));

			var folderInViewAbove = data.where({ViewId: parameters.viewId, FolderAddress: addressAbove});
			Ti.API.info("modelInFolderAbove : " + JSON.stringify(folderInViewAbove));

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
	Ti.API.info("item: " + JSON.stringify(item));
	//Get the item below the item we clicked on

	var itemBelow = e.section.getItemAt(e.itemIndex + 1);
	if(!itemBelow){  //last one in the list
		return;
	}

	var folderAddress = item.address.text;
	Ti.API.info("folderAddress: " + folderAddress);
	var addressBelow = itemBelow.address.text;
	Ti.API.info("addressBelow: " + addressBelow);
	Alloy.Collections.folderInView.fetch({
		success: function (data) {
			Ti.API.info("folderInView data: " + JSON.stringify(data));

			var folderInView = data.where({ViewId: parameters.viewId, FolderAddress: folderAddress});
			var folderInViewBelow = data.where({ViewId: parameters.viewId, FolderAddress: addressBelow});
			Ti.API.info("folderInView: " + JSON.stringify(folderInView));
			Ti.API.info("folderInViewBelow: " + JSON.stringify(folderInViewBelow));
			
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

function editFolderBtnClicked(e) {
	Ti.API.info("editFolderBtnClicked!!!");
	var btn = e.source;
	Ti.API.info("e source: " + JSON.stringify(btn));
	Ti.API.info("btn title: " + JSON.stringify(btn.title));
	if(!$.isInEditingMode) {
		btn.title = "Done";
		$.isInEditingMode = true;
		if(OS_IOS){
			$.folderListView.setEditing(true);
		} else {
			updateUI(); //We need to run updateUI so the new transform will work now that we are in editMode.
		}
		$.addFolderFab.hideMe();
	} else {
		btn.title = "Edit";
		$.isInEditingMode = false;
		if(OS_IOS) {
			$.folderListView.setEditing(false);
			updateFolderSortOrder();
		} else {
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
		callback: function (event) {
			win.close();
			if (event.success) {
				addFolder(event.content);
			} else {
				Ti.API.debug("No Folder Added");
			}
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