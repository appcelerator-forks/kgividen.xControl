var args = arguments[0] || {};
$.navWin = {};
function getPrograms(connection){
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
			alert("Getting programs failed.  Please check the network settings.");
			if (OS_IOS) {
				$.refreshControl.endRefreshing();
			}
		}
	});
}

function refresh(connection){
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
		}
		Ti.API.info("error refreshing no connection");
	}	
}	

refresh();

$.sf.addEventListener('change',function(e){
	$.programsListView.searchText = e.value;
});


/**
 * function set on the init of the view so args can be passed from the parent view.
 * @param  {Object} args Event
 */
$.init = function(args){
    $.navWin = args.navWin;
};


/**
 * event listener set on view to open the devices view so devices can be added to the folder.
 * On android if in edit mode this will open the editView so the folder can be renamed.
 * @param  {Object} e Event
 */
function select(e) {
	var item = e.section.getItemAt(e.itemIndex);
	'use strict';

	// lookup the model
	var model = Alloy.Collections.programs.get({id:item.properties.folderId});

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
	var win = Alloy.createController('programs/programs', params).getView();

	//open the window in the NavigationWindow for iOS
	if (OS_IOS) {
		$.navWin.openWindow(win);
	} else {
		win.open();   //simply open the window on top for Android (and other platforms)
	}
}

/**
 * data event filter for the ListView
 * @param  {Object} collection
 */
function filter(collection) {
	//return everything but folders.
	return collection.filter(function (program) {
		return program.get("folder") == "true";
	});
}

function closeWin(){
	$.destroy();
	$.foldersWin.close();
}
