var CONN_REMOTE = 'Remote';
var CONN_LOCAL = 'Local';
var NETWORK_BTN_REMOTE_TITLE = "Remote Connection Enabled";
var NETWORK_BTN_LOCAL_TITLE = "Local Connection Enabled";
var DEFAULT_LIGHT_FOLDER_ADDRESS = "11111";
var DEFAULT_SCENE_FOLDER_ADDRESS = "22222";
var DEFAULT_SENSOR_FOLDER_ADDRESS = "33333";
var btnOnColor="black";
var btnOffColor="gray";
var method="http";

var currentNetworkType = Titanium.App.Properties.getString('currentNetworkType') || CONN_LOCAL;
var defaultRemoteConnectionInfo = {
        'server' : 'my.isy.io',
        'method' : 'https',
        'port' : '443',
        'username' : $.username.value || '',
        'password' : $.password.value || ''
    };

function getConnectionInfo(){
    var connectionInfo = Titanium.App.Properties.getObject('conn_' + currentNetworkType) || {};
    if(currentNetworkType == "Remote") {
    	//Set the remote default connection info
    	if(!connectionInfo.server || connectionInfo.server == ""){
    		connectionInfo = defaultRemoteConnectionInfo;
    	}
    	
    	//set button colors for android and tabbedbar for ios
    	if(OS_IOS){
    		$.switchConnectionBar.setIndex(1);
    	} else {
			$.localConnectionBtn.setBackgroundColor(btnOffColor);
			$.remoteConnectionBtn.setBackgroundColor(btnOnColor);
		}
		$.currentConnectionLbl.setText("Remote Connection Enabled");
    } else {
    	if(OS_IOS){
    		$.switchConnectionBar.setIndex(0);
		} else {
			$.localConnectionBtn.setBackgroundColor(btnOnColor);
			$.remoteConnectionBtn.setBackgroundColor(btnOffColor);
		}
		$.currentConnectionLbl.setText("Local Connection Enabled");	
    }
    
    method = connectionInfo.method || '';
    
    if(method == "https") {
    	if(OS_IOS) {
    		$.switchHttpBar.setIndex(1);	
    	} else {
    		$.httpBtn.setBackgroundColor(btnOffColor);
    		$.httpsBtn.setBackgroundColor(btnOnColor);
    	}
    } else {
    	if(OS_IOS) {
    		$.switchHttpBar.setIndex(0);	
    	} else {
    		$.httpBtn.setBackgroundColor(btnOnColor);
    		$.httpsBtn.setBackgroundColor(btnOffColor);
    	}
       	
    }
    
    $.server.value = connectionInfo.server || '';
    $.port.value = connectionInfo.port || '';
    $.username.value = connectionInfo.username || '';
    $.password.value = connectionInfo.password || '';
}


function saveConnectionInfo(callback){
    //todo: validate form
    data = {
        'server' : $.server.value || '',
        'method' :method || 'http',
        'port' : $.port.value || '80',
        'username' : $.username.value || '',
        'password' : $.password.value || ''
    };
    Ti.App.Properties.setObject('conn_' + currentNetworkType, data);
    Ti.App.Properties.setObject('conn_current', data);
    Ti.App.Properties.setString('currentNetworkType',currentNetworkType);
    device.init();  //renews the connection information
    if (callback) {
    	callback();
    }
}

function closeWin () {
    saveConnectionInfo();
    Alloy.createController("index").getView().open();
    $.settingsWin.close();
}

//LISTENERS
$.clearData.addEventListener('click', function () {
    Alloy.Collections.device.fetch();
    var model;

    while (model = Alloy.Collections.device.first()) {
        model.destroy({silent: true});
    }

    Alloy.Collections.deviceInFolder.fetch();
    var model;

    while (model = Alloy.Collections.deviceInFolder.first()) {
        model.destroy({silent: true});
    }

    Alloy.Collections.folderInView.fetch();
    var model;

    while (model = Alloy.Collections.folderInView.first()) {
        model.destroy({silent: true});
    }
    Alloy.Collections.device.reset({silent: true});
    Ti.App.Properties.setObject('conn_' + CONN_REMOTE, {});
    Ti.App.Properties.setObject('conn_' + CONN_LOCAL, {});
    Ti.App.Properties.setObject('conn_current', {});
    $.server.value = '';
    method = '';
    $.port.value = '';
    $.username.value = '';
    $.password.value = '';
    alert("Data has been cleared.");
});

$.getListOfDevicesBtn.addEventListener('click', function () {
	Alloy.Globals.PW.showIndicator("Updating Devices");
    saveConnectionInfo(refreshDevices);
});

if(OS_IOS) {
	$.switchConnectionBar.addEventListener('click',function(e) {
		saveConnectionInfo(); //save before we switch.
		switch(e.index) {
			case 0: 
				$.currentConnectionLbl.setText("Local Connection Enabled");
				currentNetworkType = CONN_LOCAL;
				break;
			case 1: 
				$.currentConnectionLbl.setText("Remote Connection Enabled");
				currentNetworkType = CONN_REMOTE;
				break;	
		}
		getConnectionInfo();
	});
	
	$.switchHttpBar.addEventListener('click',function(e) {
		switch(e.index) {
			case 0: 
				method = "http";
				break;
			case 1: 
				method = "https";
				break;	
		}
	});
}

//setup the button for android
if (!OS_IOS) {
	function changeNetwork(e){
		saveConnectionInfo(); //save before we switch.
		if(e.source.id == "localConnectionBtn"){
			$.localConnectionBtn.setBackgroundColor(btnOnColor);
			$.remoteConnectionBtn.setBackgroundColor(btnOffColor);
			$.currentConnectionLbl.setText("Local Connection Enabled");
			currentNetworkType = CONN_LOCAL;
		} else {
			$.localConnectionBtn.setBackgroundColor(btnOffColor);
			$.remoteConnectionBtn.setBackgroundColor(btnOnColor);
			$.currentConnectionLbl.setText("Remote Connection Enabled");
			currentNetworkType = CONN_REMOTE;
		}  
	    getConnectionInfo();	
	}	
	
	function changeHttp(e){
		if(e.source.id == "httpBtn"){
			$.httpBtn.setBackgroundColor(btnOnColor);
			$.httpsBtn.setBackgroundColor(btnOffColor);
			method = "http";
		} else {
			$.httpBtn.setBackgroundColor(btnOffColor);
			$.httpsBtn.setBackgroundColor(btnOnColor);
			method = "https";
		}  
	}	
}


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
						processData(dbData, liveData, devicesInFolder);	
						getPrograms(dbData, devicesInFolder);	
					},
					error : function() {
						alert("An error 11 occurred!");
						Alloy.Globals.PW.hideIndicator();
					}
				});
			},
			error : function() {
				alert("An error 12 occurred!");
				Alloy.Globals.PW.hideIndicator();
			}
		});
	});
}

function getPrograms(dbData, devicesInFolder) {
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
		getProgramsLive(connection, dbData);
	} 
}

function getProgramsLive(connection, dbData) {
	Alloy.Collections.programs.fetch({
		"url": connection.baseURL + "programs",
		headers: connection.restHeaders,
		success : function(liveData) {
	        // _.each(Alloy.Collections.programs.models, function(element, index, list){
	        // });
	        processProgramData(dbData, liveData.toJSON());	
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

function processProgramData(dbData, liveData) {
	//All of the devices we just got from the live system not the DB
	var livePrograms = _.filter(liveData, function(program) {
		return program.folder != "true";
	});
	
	if (livePrograms.length > 0) {
		Ti.API.info("We have livePrograms");
		//if there is a new device add it to the DB and link it to the correct folder.
		_.each(livePrograms, function(program) {
			//check to see if the device is in the db yet
			var programExistsArray = dbData.where({address: program.id});	
			if(!programExistsArray[0]){
				//Add device to the DB
				var program = {
						"name" : program.name,
						"displayName" : program.name,
						"address" : program.id,
						"type" : "program",
						"parent" : "program"
					};
	        	var model = Alloy.createModel('Device', program);
	        	model.save();
			}
		});	
	}

	saveConnectionInfo(openSettingsMenuCallback);
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
		
		//If dbData doesn't contain a default 111 Folder then we should add them for lighting and scenes
		var defaultLightFolderFound = dbData.where({address: DEFAULT_LIGHT_FOLDER_ADDRESS});	
		if (!defaultLightFolderFound[0]) {
			//Add default folder to the DB
			createFolder({
					"name" : "Lights",
					"displayName" : "Lights",
					"address" : DEFAULT_LIGHT_FOLDER_ADDRESS,
					"type" : "folder"
			});
        	linkFolderToView(DEFAULT_LIGHT_FOLDER_ADDRESS, VIEW_ID_LIGHTS, 1);	
		}
		
		var defaultSceneFolderFound = dbData.where({address: DEFAULT_SCENE_FOLDER_ADDRESS});	
		if (!defaultSceneFolderFound[0]) {
			//Add default folder to the DB
			createFolder({
					"name" : "Scenes",
					"displayName" : "Scenes",
					"address" : DEFAULT_SCENE_FOLDER_ADDRESS,
					"type" : "folder"
			});
        	linkFolderToView(DEFAULT_SCENE_FOLDER_ADDRESS, VIEW_ID_SCENES, 1);	
		}

		var defaultSensorFolderFound = dbData.where({address: DEFAULT_SENSOR_FOLDER_ADDRESS});	
		if (!defaultSensorFolderFound[0]) {
			//Add default folder to the DB
			createFolder({
					"name" : "Sensors",
					"displayName" : "Sensors",
					"address" : DEFAULT_SENSOR_FOLDER_ADDRESS,
					"type" : "folder"
			});
        	linkFolderToView(DEFAULT_SENSOR_FOLDER_ADDRESS, VIEW_ID_SENSORS, 1);	
		}
		
				
		//All of the devices we just got from the live system not the DB
		var devicesInDefaultFolder = _.filter(liveData, function(device) {
			return device.parent == "111";
		});
		
		
		_.each(devicesInDefaultFolder, function(device) {
			//If the device has already been added to the default folder then skip it.
			var deviceInFolder = devicesInFolder.where({"DeviceAddress":device.address});
			if(deviceInFolder[0]){
				return;
			}
			if(device.type == "scene") {
				linkDeviceToFolder(device.address, DEFAULT_SCENE_FOLDER_ADDRESS, 1);	
			} else if(device.type == "sensor") {
				linkDeviceToFolder(device.address, DEFAULT_SENSOR_FOLDER_ADDRESS, 1);	
			} else {
				linkDeviceToFolder(device.address, DEFAULT_LIGHT_FOLDER_ADDRESS, 1);
			}	
		});
		
		
		//add new liveFolders to the db if they aren't already there
		_.each(liveFolders, function(folder){
			 var folderArray = dbData.where({address: folder.address});
			 //If the folder hasn't been added before then add it.
			 if (!folderArray[0]) {
			 	//Create the folder even though we don't add it to a view so we have a record with the proper address
				createFolder({
					"name" : folder.name + " Default", //Otherwise they all look the same when you add existing to views.
					"displayName" : folder.name,
					"address" : folder.address,
					"type" : folder.type,
  				});
				
				//Find all the scenes that should be added to the folder.
        		var thisFoldersScenes = _.filter(liveDevices, function(device) {
            		return device.type == "scene" && device.parent == folder.address;
            	});
            	
    			//create a scene version of the folder and link the devices to it
        		if(thisFoldersScenes && thisFoldersScenes.length > 0) {
        			folder.address = Ti.Platform.createUUID(); //so a new guid will be generated
					createFolder({
						"name" : folder.name + " Sensors", //Otherwise they all look the same when you add existing to views.
						"displayName" : folder.name,
						"address" : folder.address,
						"type" : folder.type,
	  				});
					linkFolderToView(folder.address, VIEW_ID_SCENES);	
					_.each(thisFoldersScenes, function(device) {
    					linkDeviceToFolder(device.address, folder.address);	
					});
				}
				 
            	
				//Find all the sensors that should be added to the folder.
        		var thisFoldersSensors = _.filter(liveDevices, function(device) {
            		return device.type == "sensor" && device.parent == folder.address;
            	}); 
            	
        		//create a sensor version of the folder and link the devices to it
        		if(thisFoldersSensors && thisFoldersSensors.length > 0) {
        			folder.address = Ti.Platform.createUUID(); //so a new guid will be generated
					createFolder({
						"name" : folder.name + " Scenes", //Otherwise they all look the same when you add existing to views.
						"displayName" : folder.name,
						"address" : folder.address,
						"type" : folder.type,
	  				});
					linkFolderToView(folder.address, VIEW_ID_SENSORS);	
					_.each(thisFoldersSensors, function(device) {
    					linkDeviceToFolder(device.address, folder.address);	
					});
				}
				
            	//For now we are assuming if it's not a scene or a sensor it's a light
            	var thisFoldersOther = _.filter(liveDevices, function(device) {
            		return device.type != "scene" && device.type != "sensor" && device.type != "folder" && device.parent == folder.address;
            	});        	
            	
            	//Add others to lighting view for now so we assume if it's not a scene or a seonsor it's a light
            	//create a lighting version of the folder and link the devices to it
            	if(thisFoldersOther && thisFoldersOther.length > 0) {
            		folder.address = Ti.Platform.createUUID(); //so a new guid will be generated
            		createFolder({
						"name" : folder.name + " Lights", //Otherwise they all look the same when you add existing to views.
						"displayName" : folder.name,
						"address" : folder.address,
						"type" : folder.type,
	  				});
            		//Link this new folder to the lighting view
            		linkFolderToView(folder.address, VIEW_ID_LIGHTS);	
            		_.each(thisFoldersOther, function(device) {
    					linkDeviceToFolder(device.address, folder.address);	
					});
            	}

			 }
		});
}

function openSettingsMenuCallback(){
	Alloy.Globals.PW.hideIndicator();
	Alloy.createController('settingsMenu/index').getView().open();
	alert("Devices and programs were refreshed.  All devices that were not in a folder have been added to the Default Folder.  You can now add/modify them here or in the future by going to Edit Mode using the right menu from the home screen.  Scenes have been added to the scenes view and everything else for now under the lighting view.  But feel free to add/remove things as you wish.");
	$.settingsWin.close();
}

function createFolder(folder) {
	var folder = {
					"name" : folder.name,
					"displayName" : folder.displayName,
					"address" : folder.address,
					"type" : folder.type
				  };
	var model = Alloy.createModel('Device', folder);
	model.save();
}

function linkDeviceToFolder(deviceAddress, folderAddress, sortId) {
	var obj = {
		"DeviceAddress" : deviceAddress,
		"FolderAddress" : folderAddress
	};
	if (sortId){
		obj.SortId = sortId;
	}
	var model = Alloy.createModel('DeviceInFolder', obj);
	model.save();	
}

function linkFolderToView(folderAddress, viewId, sortId) {
	var obj = {
		"FolderAddress" : folderAddress,
		"ViewId" : viewId,
	};
	if (sortId){
		obj.SortId = sortId;
	}
	var model = Alloy.createModel('FolderInView', obj);
	model.save();	
}
