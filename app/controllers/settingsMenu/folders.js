var parameters = arguments[0] || {};

Ti.API.debug("folders.js parameters:" + JSON.stringify(parameters));
$.navWin = parameters.navWin;

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
 * event listener set via view for when the user selects a ListView item
 * @param  {Object} e Event
 */
function select(e) {
	Ti.API.debug("Select!!!");
	Ti.API.debug("e: " + JSON.stringify(e));
	'use strict';

	// lookup the model
	var model = Alloy.Collections.Device.get(e.itemId);

	// trigger the select event on this controller, passing the model with it
	// the index controller has an event listener for this event
	//Setup the trigger for android if in edit mode.
	if(!OS_IOS && $.editMode) {
		$.trigger('editFolderClicked', e); //Trigger is in index.xml
	} else {
		$.trigger('select', {
			model: model
		});
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
		$.trigger('editFolderClicked', e); //Trigger is in index.xml

	} else if (e.action=="DELETE") {
		alert("You can't delete a folder yet");
	}
}

/**
 * event listener set via view for when the user clicks the close window button.
 * @param  {Object} e Event
 */

function closeFolderBtnClicked(e) {
	Ti.API.debug("Folder window close button clicked");
	Alloy.createController("index").getView().open();
	$.foldersWin.close();
	$.destroy();
	//$.trigger('folderWindowClose'); //Trigger is in index.xml


}
/**
 * event listener set via view for when the user clicks the edit button.
 * @param  {Object} e Event
 */

function editFolderBtnClicked(e) {
	Ti.API.debug("editFolderClicked!!!");
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
 * event listener set via index.xml view for when the user clicks the floating add button.
 */
function addFolderClicked() {
	Ti.API.debug("addFolderClicked!!!");
    $.trigger('addFolderClicked', {}); //Trigger is in index.xml
}

/**
 * event listener set via view for when the user clicks the floating add button.
 */
$.addFolderFab.onClick(function(e) {
	addFolderClicked();
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