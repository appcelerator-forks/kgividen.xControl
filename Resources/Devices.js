var ISY = require('ISYRestCalls');
var restCall = require('RestCall');	

exports.getDevicesLive = function(callback) {
	getFoldersAndNodes(callback);		
}

exports.setDeviceValue = function(callback) {
	var e = arguments[1];
	//insteon 100% brightness = 255
	var level = Math.round(e.source.value / 100 * 255);
	var address = e.source.address;
	if (level == 0) {
		ISY.deviceOff(callback, address);
	} else {
		ISY.deviceOn(callback, address, level);
	}
}
var callToggleDevice = function(statusXML,data){
	toggleDevice(data.callback, statusXML, data.address);		
}
exports.getStatusThenToggleDevice = function(callback) {
	var address = arguments[1];
	ISY.deviceGetStatus(callToggleDevice, address, callback);
}

exports.getCurrentStatusOfDevices = function(callback) {
	ISY.getDevicesStatusXML(callback);
}

exports.sceneOn = function(callback, address){
	var level = 255;
	ISY.deviceOn(callback, address, level);	
}

exports.sceneOff = function(callback, address){
	ISY.deviceOff(callback, address);	
}
var getCurrentStatusOfDevices = function(responseData, data) {
	//This is called after the toggle device so it will refresh after the toggle.
	//Then the updateStatusOfDevicesOnView is called to refresh the view.  That's what the data.callback is but it's a little hokey to pass that through like that.
	//todo: We need this delay cause the response can come back faster than when it's updated by the toggle.  
	//Once we put a listener for the auto updates we shouldn't have to do this anymore.
	setTimeout(function() { 
		ISY.getDevicesStatusXML(data.callback);
	}, 500);
	 
}

var getFoldersAndNodes = function(callback){
	Ti.API.info('In GetFoldersAndNodes');
	//One of the callback here is going to be populateDevicesDB but we need to processFoldersAndNodes first
	//todo: This should probably be moved into the ISY code
	restCall.doRestCall(processFoldersAndNodes, 'nodes/', callback);		
}
	
var processFoldersAndNodes = function (xmlData, callback) {
	try{
		var xml = xmlData.responseXML;
	}catch(e){
		alert('Data Error.  Please check the connection information.');
		return;	
	}
	Ti.API.info('In processFoldersAndNodes.  xml:' + xmlData);
	if(xml == null || xml == 'undefined'){
		callback = null;
		alert('No data found.  Please check the connection information.')
		return;
	}
	var xml = xmlData.responseXML;
	
	var nodesXML = xml.documentElement.getElementsByTagName('node');

	var foldersAndNodes = getFolders(xmlData);
	
	//get the nodes
	for (var i = 0; i < nodesXML.length; i++) {
		var nodeAddress = nodesXML.item(i).getElementsByTagName('address').item(0).text;
		var nodeName = nodesXML.item(i).getElementsByTagName('name').item(0).text;
		if (nodesXML.item(i).getElementsByTagName('parent').item(0) != null) {
			var nodeParent = nodesXML.item(i).getElementsByTagName('parent').item(0).text;
		} else {
			var nodeParent = '111'; //This is hardcoded as the MISC folder.
		}

		Ti.API.info('node name: ' + nodeName + ' address:' + nodeAddress);
		
		//This pushes all of the nodes under the folder heirchy
		for (var j = 0; j < foldersAndNodes.length; j++) {
			if (foldersAndNodes[j].folderAddress == nodeParent) {
				foldersAndNodes[j].folderNodes.push({
					nodeName : nodeName,
					nodeAddress : nodeAddress,
					nodeParent : nodeParent,
					nodeType : 'load'
				});
			}
		}
	}	

	//get the scenes
	var groupsXML = xml.documentElement.getElementsByTagName('group');
	//Add a default parent for scenes/groups
	var folderNodes = [];
	foldersAndNodes.push({
		folderName : 'Scenes (Status is not available for scenes.)',
		folderAddress : '222',
		folderNodes : folderNodes
	});
	for (var i = 0; i < groupsXML.length; i++) {
		var groupAddress = groupsXML.item(i).getElementsByTagName('address').item(0).text;
		var groupName = groupsXML.item(i).getElementsByTagName('name').item(0).text;	
		//since we just added the Scenes Folder we know it's the last one.  So we'll just add all these to the last folder
		foldersAndNodes[foldersAndNodes.length - 1].folderNodes.push({
			nodeName : groupName,
			nodeAddress : groupAddress,
			nodeType: 'scene'			
		});
	}
	callback(foldersAndNodes);
}

function getFolders(xmlData){
	var xml = xmlData.responseXML;
	var foldersXML = xml.documentElement.getElementsByTagName('folder');
	var folders = [];
	var folderNodes = [];
	for (var i = 0; i < foldersXML.length; i++) {
		folderNodes = [];
		var folderAddress = foldersXML.item(i).getElementsByTagName('address').item(0).text;
		var folderName = foldersXML.item(i).getElementsByTagName('name').item(0).text;		
		folders.push({
			folderName : folderName,
			folderAddress : folderAddress,
			folderNodes : folderNodes
		});
	}
	//Add a default parent for those devices that don't have one
	folders.push({
		folderName : 'Default',
		folderAddress : '111',
		folderNodes : folderNodes
	});
		
	Ti.API.info('folders:' + folders.toString);
	
	return folders;
}

var toggleDevice = function(callback,statusXML,address) {
	var deviceStatus = processStatusXML(statusXML);
	Ti.API.info('status is ToggleDevice: ' + deviceStatus + ' Address of device: ' + address);
	if (deviceStatus == 'On') {
		// deviceFastOff(null,address);
		// getCurrentStatusOfDevices(callback);
		ISY.deviceFastOff(getCurrentStatusOfDevices, address, callback);
	} else {
		ISY.deviceFastOn(getCurrentStatusOfDevices, address, callback);
	}
}




//*************************************HELPER METHODS*************************************
var processStatusXML = function(xmlData) {

	var doc = xmlData.responseXML.documentElement;
	var elements = doc.getElementsByTagName('property');
	var property = elements.item(0);
	var status = property.getAttribute('formatted');

	return status;
}