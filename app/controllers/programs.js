var args = arguments[0] || {};

function doOpen(){
	Ti.API.info("program refresh!!!");
	device.loadPrograms();
}	

function refresh(){
	Ti.API.info("program refresh!!!");
	device.loadPrograms(function() {
		Alloy.Collections.programs.fetch({
			success : function(data) {
				Ti.API.info("data programs: " + JSON.stringify(data));
				if (OS_IOS) {
					$.refreshControl.endRefreshing();
				}
			},
			error : function() {
				Ti.API.debug("fetch programs Failed!!!");
				if (OS_IOS) {
					$.refreshControl.endRefreshing();
				}
			}
		});
	});
}	
/**
 * data event transform function for the ListView
 * @param  {Object} model
 */
function transform(model) {
	var transform = model.toJSON();
	Ti.API.info("transform: " + JSON.stringify(transform));
	// var type = model.get("type");
	// //lightTemplate is the default
	// if($.editModeDevices == true && !OS_IOS) { //Only need to show new icons for Android
		// transform.t = "editTemplate";
		// return transform;
	// } 
// 
	// if(type == "folder") {
		// transform.t = "folderTemplate";
	// } else if(type == "scene"){
		// transform.t = "sceneTemplate";
	// }

	return transform;
}


/**
 * data event filter for the ListView
 * @param  {Object} collection
 */
function filter(collection) {
	//return everything but folders.
	return collection.filter(function (device) {
		return device.get("type") !== 'folder';
	});
}
