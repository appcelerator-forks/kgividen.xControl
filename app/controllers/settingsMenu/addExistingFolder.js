var parameters = arguments[0] || {};
var callbackFunction = parameters.callback || null;

function init(){
	
	//We are going to use SQL in this case because it seems to be much faster than using a dataFilter.
	var deviceTable = Alloy.Collections.device.config.adapter.collection_name;
	var sql = "SELECT * FROM " + deviceTable + " WHERE type = 'folder'";

	Alloy.Collections.folder.fetch({
		query:sql,
		success: function (data) {
			updateUI();
		},
		error: function () {
			Ti.API.info("addexistingFolder fetch Failed!!!");
		}
	});
}
	
// EVENT HANDLERS
/**
 * function called when save button clicked that executes the callback from the folders.js
 * @param  {Object} event
 */
function select(e) {
	var item = e.section.items[e.itemIndex];
	var folder = {
		address: item.address.text
	}; 
	
    var returnParams = {
        success : true,
        content : folder
    };

    // return to comment.js controller to add new comment
    callbackFunction && callbackFunction(returnParams);
}

function closeWin() {
    var returnParams = {
        success : true,
    };
    // return to folders.js controller to add new folder
    callbackFunction && callbackFunction(returnParams);
}

/**
 * event listener set via view to provide a search of the ListView.
 * @param  {Object} e Event
 */
$.sf.addEventListener('change',function(e){
	$.folderListView.searchText = e.value;
});

/**
 * event listener to destroy all event listeners setup by Alloy.
 */
$.foldersWin.addEventListener("close", function(){
    $.destroy();
});

init();
