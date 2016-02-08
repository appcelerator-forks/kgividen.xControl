var parameters = arguments[0] || {};
var callbackFunction = parameters.callback || null;

Alloy.Collections.Device.fetch({
	success: function (data) {
		Ti.API.debug("addexistingFolder fetch success!!!");
	},
	error: function () {
		Ti.API.debug("addexistingFolder fetch Failed!!!");
	}
});
	
	
	
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
 * event listener to destroy all event listeners setup by Alloy.
 */
$.foldersWin.addEventListener("close", function(){
    $.destroy();
});

/**
 * data event transform function for the ListView
 * @param  {Object} model
 */
function transform(model) {
	
	return model.toJSON();
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