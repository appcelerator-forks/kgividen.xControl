var args = arguments[0] || {};

function getPrograms(connection){
	Alloy.Collections.programs.fetch({
		"url": connection.baseURL + "programs?subfolders=true",
		headers: connection.headers,
		success : function(data) {
			if (OS_IOS) {
				$.refreshControl.endRefreshing();
			}
			Alloy.Globals.PW.hideIndicator();
		},
		error : function() {
			alert("Getting programs failed.  Please check the network settings.");
			Alloy.Globals.PW.hideIndicator();
			if (OS_IOS) {
				$.refreshControl.endRefreshing();
			}
		}
	});
}

var refresh = function (){
	device.init();
	var connection = device.getConnection();
	if(connection && connection.baseURL){
		getPrograms(connection);
	} else {
		if (OS_IOS) {
			$.refreshControl.endRefreshing();
		}
	}	
};	

function runProgram(e){
    var item = e.section.items[e.itemIndex];
    var runType = ""; //This is the default
    if(e.bindId=="btnRunThen") {
    	runType = "Then";
    } else if (e.bindId=="btnRunElse") {
    	runType = "Else";
    }
    
    if(!item.properties.programId){
        return;
    }
    device.runProgram(item.properties.programId, runType, refresh);
}

Alloy.Globals.PW.showIndicator("Getting Programs");
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
		
		_.each(transform, function(val, attr){
			if(_.isEmpty(val)){
				transform[attr] = "unknown";	
			}
		});
		
		//leave it if it's unknown but otherwise change label to enabled/disabled
		if(transform.enabled == "true") {
			transform.enabled = "enabled";
			transform.switchValue = true;
		} else if (transform.enabled == "false"){
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
	return collection.filter(function (program) {
		return program.get("folder") != "true" && program.get("parentId") == args.model.id;
	});
}



function programSwitchChanged(e) {
	var item = e.section.items[e.itemIndex];
    if (e.value) {
    	item.switchEnabled.text = "enabled";
    	device.enableProgram(item.properties.programId, refresh);  
    } else {
    	item.switchEnabled.text = "disabled";
      	device.disableProgram(item.properties.programId, refresh);
    }
}

function closeWin(){
	$.destroy();
	$.programsWin.close();
}
