var args = arguments[0] || {};

// function doOpen(){
	// Ti.API.info("program doOpen!!!");
	refresh();
// }	

function refresh(){
	Ti.API.info("program refresh!!!");
	Alloy.Collections.programs.fetch({
		success : function(data) {
			// Ti.API.info("data programs: " + JSON.stringify(data));
			// Ti.API.info("Alloy.Collections.programs.models: " + JSON.stringify(Alloy.Collections.programs.models));
	        // _.each(Alloy.Collections.programs.models, function(element, index, list){
	        	// Ti.API.info("element: " + element + " index: " + index + " list: " + list);
	            // We are looping through the returned models from the remote REST API
	            // Implement your custom logic here
	        // });
			if (OS_IOS) {
				// $.refreshControl.endRefreshing();
			}
		},
		error : function() {
			Ti.API.debug("fetch programs Failed!!!");
			if (OS_IOS) {
				// $.refreshControl.endRefreshing();
			}
		}
	});
}	

$.sf.addEventListener('change',function(e){
	$.programsListView.searchText = e.value;
});



/**
 * data event transform function for the ListView
 * @param  {Object} model
 */
function transform(model) {
	var transform = model.toJSON();
	//the enabled flag makes it crash on iOS so moving it over
	
	_.defaults(transform, {
			"lastRunTime": "unknown",
			"lastFinishTime": "unknown",
			"nextScheduledRunTime": "unknown",
			"parentId": "unknown",
			"status": "unknown",
			"folder": "unknown",
			"enabled": "unknown",
			"runAtStartup": "unknown",
			"running": "unknown"
		});
		
		// Ti.API.info("transform enabled: " + JSON.stringify(transform.enabled));
		_.each(transform, function(val, attr){
			if(_.isEmpty(val)){
				transform[attr] = "unknown";	
			}
		});
		
		//leave it if it's unknown but otherwise change label to enabled/disabled
		if(transform.enabled == "true") {
			transform.enabled = "enabled";
			transform.switchValue = true;
		} else if (transform.enabled =="false"){
			transform.enabled = "enabled";
			transform.switchValue = false;
		} else {
			transform.switchValue = false;
		}

	Ti.API.info("transform: " + JSON.stringify(transform));
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



function runProgram(){
	alert("blah");
}
