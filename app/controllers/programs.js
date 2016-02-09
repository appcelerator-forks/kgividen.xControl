var args = arguments[0] || {};

function doOpen(){
	Ti.API.info("program doOpen!!!");
	refresh();
}	

function refresh(){
	Ti.API.info("program refresh!!!");
	Alloy.Collections.programs.fetch({
		success : function(data) {
			Ti.API.info("data programs: " + JSON.stringify(data));
			Ti.API.info("Alloy.Collections.programs.models: " + JSON.stringify(Alloy.Collections.programs.models));
	        _.each(Alloy.Collections.programs.models, function(element, index, list){
	        	// Ti.API.info("element: " + element + " index: " + index + " list: " + list);
	            // We are looping through the returned models from the remote REST API
	            // Implement your custom logic here
	        });
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
