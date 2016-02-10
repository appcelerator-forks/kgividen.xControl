var args = arguments[0] || {};

function getPrograms(connection){
	Ti.API.info("program refresh!!!");
	Alloy.Collections.programs.fetch({
		"url": connection.baseURL + "programs",
		headers: connection.restHeaders,
		success : function(data) {
	        // _.each(Alloy.Collections.programs.models, function(element, index, list){
	        // });
			if (OS_IOS) {
				$.refreshControl.endRefreshing();
			}
		},
		error : function() {
			Ti.API.debug("fetch programs Failed!!!");
			alert("Getting programs failed.  Please check the network settings.");
			if (OS_IOS) {
				$.refreshControl.endRefreshing();
			}
		}
	});
}

function refresh(connection){
	// var d = require('isy');
	device.init();
	var connection = device.getConnection();
	//Convert headers from array to obj
	var restHeaders = {};
	if(connection && connection.baseURL){
		var headers = {};
		_.each(connection.headers, function(header){
			restHeaders[header.name] = header.value;
		});
		connection.restHeaders = restHeaders;
		getPrograms(connection);
	} else {
		if (OS_IOS) {
			$.refreshControl.endRefreshing();
			Ti.API.info("error refreshing no connection");
		}
	}	
}	

refresh();

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
			transform.enabled = "disabled";
			transform.switchValue = false;
		} else {
			transform.enabled = "disabled";
			transform.switchValue = false;
		}

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

function runProgram(e){
	Ti.API.info("run Program e: " + JSON.stringify(e));
    var item = e.section.items[e.itemIndex];
    Ti.API.info("run Program item: " + JSON.stringify(item));
    if(!item.btn.id){
        return;
    }
    device.runProgram(item.btn.id);
	refresh();
}

function programSwitchChanged(e) {
	var item = e.section.items[e.itemIndex];
	Ti.API.info("item: " + JSON.stringify(item));
    if (e.value) {
    	Ti.API.info("program enabled!");
    	item.switchEnabled.text = "enabled";
    	device.enableProgram(item.btn.id);  
    } else {
    	Ti.API.info("program disabled!");
    	item.switchEnabled.text = "disabled";
      	device.disableProgram(item.btn.id);
    }
    refresh();
}
