var CONN_REMOTE = 'Remote';
var CONN_LOCAL = 'Local';
var NETWORK_BTN_REMOTE_TITLE = "Remote Connection Enabled";
var NETWORK_BTN_LOCAL_TITLE = "Local Connection Enabled";

var currentNetworkType = Titanium.App.Properties.getString('currentNetworkType') || CONN_LOCAL;

function getConnectionInfo(){
    var connectionInfo = Titanium.App.Properties.getObject('conn_' + currentNetworkType) || {};
    $.changeNetworkBtn.title = (currentNetworkType == CONN_REMOTE) ? NETWORK_BTN_REMOTE_TITLE : NETWORK_BTN_LOCAL_TITLE;;
    $.server.value = connectionInfo.server || '';
    $.method.value = connectionInfo.method || '';
    $.port.value = connectionInfo.port || '';
    $.username.value = connectionInfo.username || '';
    $.password.value = connectionInfo.password || '';
}


function saveConnectionInfo(){
    //todo: validate form
    data = {
        'server' : $.server.value || '',
        'method' :$.method.value || 'http',
        'port' : $.port.value || '80',
        'username' : $.username.value || '',
        'password' : $.password.value || ''
    };
    Ti.API.info("conn_info: " + JSON.stringify(data));
    Ti.App.Properties.setObject('conn_' + currentNetworkType, data);
    Ti.App.Properties.setObject('conn_current', data);
    Ti.App.Properties.setString('currentNetworkType',currentNetworkType);
    device.init();  //renews the connection information
}

function closeWin () {
    saveConnectionInfo();
    Alloy.createController("index").getView().open();
    $.settingsWin.close();
}

//LISTENERS
$.clearData.addEventListener('click', function () {
    Ti.API.info("DATA CLEARED!");
    var deviceCol = Alloy.Collections.device;
    deviceCol.fetch();
    var model;

    while (model = deviceCol.first()) {
        model.destroy({silent: true});
    }
    Alloy.Collections.device.reset({silent: true});
    Ti.App.Properties.setObject('conn_' + CONN_REMOTE, {});
    Ti.App.Properties.setObject('conn_' + CONN_LOCAL, {});
    Ti.App.Properties.setObject('conn_current', {});
    $.server.value = '';
    $.method.value = '';
    $.port.value = '';
    $.username.value = '';
    $.password.value = '';
});

$.getListOfDevicesBtn.addEventListener('click', function () {
    saveConnectionInfo();
    refreshDevices();
});

$.changeNetworkBtn.addEventListener('click', function(e) {
    saveConnectionInfo(); //save before we switch.
    //Toggle the network Type
    if(currentNetworkType == "Remote"){
        currentNetworkType = CONN_LOCAL;
        $.changeNetworkBtn.title = NETWORK_BTN_LOCAL_TITLE;
    }else{
        currentNetworkType = CONN_REMOTE;
        $.changeNetworkBtn.title = NETWORK_BTN_REMOTE_TITLE;
    }
    getConnectionInfo();
});


$.settingsWin.addEventListener("close", function(){
    $.destroy();
});
getConnectionInfo();

function refreshDevices(){
	
    //device is set in alloy.js
    device.getListOfDevices().then(function (liveData) {
        //TODO Take out fake data line
        // liveData = fakeData;
        _.each(data,function(item){
            //add all of the defaults if they aren't there for the model
            _.defaults(item,{displayName:item.name}, {parent:"unknown"}, {type:"unknown"});
        });

        //Add all of the new records in the collection that came from the hardware device.
        Alloy.Collections.device.fetch({
			success : function(dbData) {
				
				Alloy.Collections.deviceInFolder.fetch({
					success : function(devicesInFolder) {
						Ti.API.info("dbData in success of deviceInFolder: " + JSON.stringify(dbData));
						processData(dbData, liveData, devicesInFolder);		
					},
					error : function() {
						Ti.API.debug("DeviceInFolder fetch Failed!!!");
					}
				});
			},
			error : function() {
				Ti.API.debug("Device Fetch Failed!!!");
			}
		});
	});
}

function processData(dbData, liveData, devicesInFolder) {
		//Get all the folders and add them first if they haven't already been added.
		//All of the folders we just got from the live system not the DB
		var liveFolders = _.filter(liveData, function(device) {
			return device.type == "folder";
		});
		
		//All of the devices we just got from the live system not the DB
		var liveDevices = _.filter(liveData, function(device) {
			return device.type != "folder";
		});
		
		//if there is a new device add it to the DB and link it to the correct folder.
		_.each(liveDevices, function(device) {
			//check to see if the device is in the db yet
			var deviceExistsArray = dbData.where({address: device.address});	
			if(!deviceExistsArray[0]){
				//Add device to the DB
				var device = {
						"name" : device.name,
						"displayName" : device.name,
						"address" : device.address,
						"type" : device.type,
						"parent" : device.parent
					};
            	var model = Alloy.createModel('Device', device);
            	model.save();
			}
		});	
		
		//add new liveFolders to the db if they aren't already there
		_.each(liveFolders, function(folder){
			 var folderArray = dbData.where({address: folder.address});	
			 //If the folder hasn't been added before then add it.
			 if (!folderArray[0]) {
			 	//Create the folder even though we don't add it to a view so we have a record with the proper address
				var folder = {
					"name" : folder.name,
					"displayName" : folder.name,
					"address" : folder.address,
					"type" : folder.type,
  				};
				var model = Alloy.createModel('Device', folder);
				model.save();
				
				//Find all the scenes that should be added to the folder.
        		var thisFoldersScenes = _.filter(liveDevices, function(device) {
            		return device.type == "scene" && device.parent == folder.address;
            	}); 
            	
            	//For now we are assuming if it's not a scene it's a light
            	var thisFoldersOther = _.filter(liveDevices, function(device) {
            		return device.type != "scene" && device.type != "folder" && device.parent == folder.address;
            	});        	
            	
            	//Add others to lighting view for now so we assume if it's not a scene it's a light
            	//create a lighting version of the folder and link the devices to it
            	if(thisFoldersOther && thisFoldersOther.length > 0) {
            		var newFolderAddress = createFolder(folder);
            		//Link this new folder to the lighting view
            		linkFolderToView(newFolderAddress, VIEW_ID_LIGHTS);	
            		_.each(thisFoldersOther, function(device) {
    					linkDeviceToFolder(device.address, newFolderAddress);	
					});
            	}
				
        		//create a scene version of the folder and link the devices to it
        		if(thisFoldersScenes && thisFoldersScenes.length > 0) {
					var newFolderAddress = createFolder(folder);
					linkFolderToView(newFolderAddress, VIEW_ID_SCENES);	
					_.each(thisFoldersScenes, function(device) {
    					linkDeviceToFolder(device.address, newFolderAddress);	
					});
				}
			 }
			 
			 
			 //TODO What about devices that don't have a parent specified?  Filter them here and add them to the other folder and then the lighting view
			 
		});
		alert("Devices were refreshed.  You can now add/modify them here or by going to Update/Edit Devices.  Scenes have been added to the scenes view and everything else for now under the lighting view.  But feel free to add/remove things as you wish.");
	    $.settingsWin.close();
    	Alloy.createController('/settingsMenu/index').getView().open();
}

function createFolder(folder) {
	var guid = Ti.Platform.createUUID();
	var folder = {
					"name" : folder.name,
					"displayName" : folder.name,
					"address" : guid,
					"type" : folder.type,
					// "originalAddr" : blah
				  };
	var model = Alloy.createModel('Device', folder);
	model.save();
	return guid;
}
function linkDeviceToFolder(deviceAddress, folderAddress) {
	var obj = {
		"DeviceAddress" : deviceAddress,
		"FolderAddress" : folderAddress,
	};
	var model = Alloy.createModel('DeviceInFolder', obj);
	model.save();	
}

function linkFolderToView(folderAddress, viewId) {
	var obj = {
		"FolderAddress" : folderAddress,
		"ViewId" : viewId,
	};
	var model = Alloy.createModel('FolderInView', obj);
	model.save();	
}

//FAKE DATA

var fakeData = [
    {
        "name": "Kitchen Folder",
        "address": "29764",
        "type": "folder"
    },
    {
        "name": "Blah Folder",
        "address": "123",
        "type": "folder"
    },
    {
        "name": "Blah Light Floods",
        "parent": "123",
        "type": "light",
        "address": "20 88 444"
    },
    {
        "name": "Backyard Floods",
        "parent": "29764",
        "type": "light",
        "address": "20 88 48 1"
    },
    {
        "name": "Kitchen Scene",
        "parent": "29764",
        "type": "scene",
        "address": "20 91 DD 1"
    },
    {
        "name": "Kitchen Sink",
        "parent": "29764",
        "type": "light",
        "address": "20 95 1D 1"
    },
    {
        "name": "Patio",
        "parent": "29764",
        "type": "light",
        "address": "20 A8 FC 1"
    },
    {
        "name": "Dining Area",
        "parent": "1111",
        "type": "light",
        "address": "20 AE 83 1"
    },
    {
        "name": "Kitchen Under Cabinets",
        "parent": "29763",
        "type": "light",
        "address": "20 B1 50 1"
    },
    {
        "name": "Kitchen Light",
        "parent": "29764",
        "type": "light",
        "address": "20 B2 AF 1"
    }
];
