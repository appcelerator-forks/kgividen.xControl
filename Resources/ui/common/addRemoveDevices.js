function addRemoveDevices() {
	
	var db = require('db');
	var devices = require('Devices');
		
	var closeBtn = Ti.UI.createButton({
		title : 'Close',
		top: '90%',
		right : '8%'

	});
		
	var self = Ti.UI.createWindow({
		rightNavButton: closeBtn,
		backgroundColor : 'white'
	});	
	
	self.orientationModes = [
	    Ti.UI.LANDSCAPE_LEFT,
	    Ti.UI.LANDSCAPE_RIGHT
	];	
	
	closeBtn.addEventListener('click', function(e){
		self.close();
	});
	
	self.add(closeBtn);
		
	var devicesTableView = Ti.UI.createTableView({
		top:25,
		height:'85%',
		borderColor:'#959EAC',
		borderWidth:1,
		borderRadius:5,
		editable: true
	});

	// Create a Label.
	var headerTitle = Ti.UI.createLabel({
		text : 'Title',
		color: 'black',
		top : 1,
		left : 5
	});
	
	var visibleTitle = Ti.UI.createLabel({
		text : 'Visible',
		color : 'black',
		top : 1,
		left : '56%'
	});	
	// Add to the parent view.
	self.add(headerTitle);
	self.add(visibleTitle);
		
		
	function populateTvDevicesTbl(retData){
		var deviceTblData = [];

		for (var i = 0; i < retData.length; i++) {
			deviceTblData[i+1] = addDeviceTblRow(retData[i]);
		}
		devicesTableView.setData(deviceTblData);		
	}
	


	devicesTableView.addEventListener('delete',function(e) {
		db.deleteDevice(e.rowData.id);
	});
		
	function addDeviceTblRow(device) {
		var row = Ti.UI.createTableViewRow();
		
		//set the row height depending on the platform.
		if(Ti.Platform.osname === 'android'){
			row.height = 80;
		}else{
			row.height = '10%';	
		}
		
				
		//Create a Button.
		var moveDownBtn = Ti.UI.createButton({
			left : '81%',
			direction : 'down',
			address : device.deviceAddress,
			sortId : device.sortId,
			backgroundColor: 'transparent',
			image : '/images/glyphicons_212_down_arrow.png'
		});
		
		// Add to the parent view.
		row.add(moveDownBtn);
		
		//Create a Button.
		var moveUpBtn = Ti.UI.createButton({
			left : '91%',
			direction : 'up',
			address : device.deviceAddress,
			sortId : device.sortId,
			backgroundColor: 'transparent',
			image : '/images/glyphicons_213_up_arrow.png'
		});
		
		// Add to the parent view.
		row.add(moveUpBtn);
		
		var swInListView = Ti.UI.createSwitch({
			left:'55%',
			value:device.showInListView
		});
		
		row.add(swInListView);
	
		swInListView.addEventListener('change', function(e) {
			//if switch on update inListView to true.  If switch off inListView = false
			if(e.value){
				db.updateDeviceShowInListView(device.deviceAddress, true);	
			}else{
				db.updateDeviceShowInListView(device.deviceAddress, false);	
			}
			
		});
		
		// var swInFloorPlanView = Ti.UI.createSwitch({
			// left:'62%',
			// value:device.showInFloorPlanView
		// });
		
		// row.add(swInFloorPlanView);
	
		// swInFloorPlanView.addEventListener('change', function(e) {
			// //if switch on update inFloorPlan to true.  If switch off inFloorPlan = false
			// if(e.value){
				// db.updateDeviceShowInFloorPlanView(device.deviceAddress, true);	
			// }else{
				// db.updateDeviceShowInFloorPlanView(device.deviceAddress, false);	
			// }
// 			
		// });
		
		row.addEventListener('click',function(e){
		    if (typeof(e.source.direction) != 'undefined') {
		        moveRow(e.source.address, e.source.sortId, e.source.direction);
		    }
		});
		
		function moveRow(address, sortId, direction){
			//todo: if up then -1 sortId else if down +1 sortId
			var data = {
				'address' : address,
				'sortId' : sortId,
				'direction' : direction
			};
			db.selectDevices(moveRowInDB, data);
		};
		
		function moveRowInDB(retData, data){
			var sortId = data.sortId;
			var direction = data.direction;
			var address = data.address;
			var newSortId = sortId;
			if(direction == 'up' && sortId != '0'){
				newSortId--;
			}else if (direction == 'down'){
				newSortId++;
			}
			var newData = []; 
			newData = retData.move(sortId, newSortId);
			//re-sort, update sort IDs in db and refresh
			updateDevicesInDB(newData);
			db.selectDevices(populateTvDevicesTbl);
		}
		
		// Create a Label.
		var lblDeviceType = Ti.UI.createLabel({
			font:{fontSize:12},
			color : 'black',
			left : '35%',
			textAlign : 'left'
		});
		lblDeviceType.text = device.deviceType;
		row.add(lblDeviceType);
				
		// Create a Label.
		var deviceLbl = Ti.UI.createLabel({
			text : device.displayName,
			color: 'black',
			left: 10,
			textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT			
		});
		
		row.add(deviceLbl);
		
		row.className = 'control';
		row.id = device.id;  //this is used to identiy the device in the table to delete it.
		return row;
	}
	
	function updateDevicesInDB(data){
		for (var i=0; i < data.length; i++){
			db.updateDeviceSortId(data[i].deviceAddress,i);
		}	
	}
	//Add Folders and Devices to the devices table when a button is clicked.
	function populateDevicesDB(retDevices) {
		for (var i = 0; i < retDevices.length; i++) {	
			//add folder to the devices table 
			var folderName = retDevices[i].folderName;
			var displayName = folderName; //todo: make this editable
			var folderAddress = retDevices[i].folderAddress;
			var currentDevicesInDB = db.selectArrayOfDeviceAddress();
			var inDB = currentDevicesInDB.indexOf(folderAddress);	
			var sortId = i;	
			//if folder doesn't exist then add it	
			if(inDB == -1){
				db.addDevice(folderName,sortId,displayName,folderAddress,true,true,'Folder','');
			}		

			for (var j = 0; j < retDevices[i].folderNodes.length; j++) {
				var nodeName = retDevices[i].folderNodes[j].nodeName;
				var displayName = nodeName; //todo: make this editable
				var nodeAddress = retDevices[i].folderNodes[j].nodeAddress;
				var nodeType = retDevices[i].folderNodes[j].nodeType;
				var nodeParent = retDevices[i].folderNodes[j].nodeParent;
								
				//if device doesn't exist then add it.
				var inDB = currentDevicesInDB.indexOf(nodeAddress);			
				if(inDB == -1){
					db.addDevice(nodeName,sortId,displayName,nodeAddress,true,false,nodeType,nodeParent);	
				}
			}
		}
		
		//refresh the table view with the devices
		db.selectDevices(populateTvDevicesTbl);
	}
	devices.getDevicesLive(populateDevicesDB);
	db.selectDevices(populateTvDevicesTbl);	
	
	// self.add(populateDevicesBtn);	
	self.add(devicesTableView);

	return self;
};

module.exports = addRemoveDevices;