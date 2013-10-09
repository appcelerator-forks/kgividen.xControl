//Settings View Component Constructor

//todo: Need to combine the Settings here with the one under the handheld.

var SettingsView = function (props, listView) {

//*************PROPERTIES (Set from the ApplicationWindow.js)****************************
	//todo://jkg: There is probably a better way to pass these in.  Alloy?
	var tvConnectionInfoHeaderProps = props.settingsViewProps[0].tvConnectionInfoHeaderProps;
	var connectionInfoTableViewProps = props.settingsViewProps[0].connectionInfoTableViewProps;
	var tvDevicesHeaderProps = props.settingsViewProps[0].tvDevicesHeaderProps;
	var tvDeviceLblTypeProps = props.settingsViewProps[0].tvDeviceLblTypeProps;
	var tvInListViewLblProps = props.settingsViewProps[0].tvInListViewLblProps;
	var tvInFloorPlanViewLblProps = props.settingsViewProps[0].tvInFloorPlanViewLblProps;
	var populateDevicesBtnProps = props.settingsViewProps[0].populateDevicesBtnProps;
	var tvDevicesTblProps = props.settingsViewProps[0].tvDevicesTblProps;
	var tvDevicesLblProps = props.settingsViewProps[0].tvDevicesLblProps;
	var addBackgroundBtnProps = props.settingsViewProps[0].addBackgroundBtnProps;
	var connTVRowProps = props.settingsViewProps[0].connViewRowProps;
	var connTVRowLblProps = props.settingsViewProps[0].connTVRowLblProps;
	var connTVRowTextFieldProps = props.settingsViewProps[0].connTVRowTextFieldProps;
	var settingsViewProps = props.settingsViewProps[0].settingsViewProps;
	var closeBtnProps = props.settingsViewProps[0].closeBtnProps;
	var swInListViewProps = props.settingsViewProps[0].swInListViewProps;
//***************END OF PROPERTIES********************		
	var closeBtn = Ti.UI.createButton(closeBtnProps);	
	
	var settingsView = Ti.UI.createView({
		// rightNavButton: closeBtn,
		backgroundColor: 'white',
		scrollable : false,
		layout:'vertical'
	});	
		
	closeBtn.addEventListener('click', function(e){
		saveConnectionInfo();
		listView.remove(settingsView);
		Ti.App.Properties.setString('hasRunBefore', true);
		listView.fireEvent('myFocus',{ 'scroller': e.source });
	});
	
	var devices = require('Devices');
	var db = require('db');
	

	//*******CONNECTION INFORMATION****************
	// Add Login Information tableview
	var tvConnectionInfoHeaderLbl = Ti.UI.createLabel(tvConnectionInfoHeaderProps);
	
	var textFields = [];
	var connectionData = [
		{	
			label:'Server',
			field: 'ipaddress'
		},{
			label:'Port',
			field: 'port'
		},{
			label:'Username', 
			field:'username' 
		},{
			label:'Password', 
			field:'password' 
		}
	];
	var connTblData=[];
	
	var def_ipaddress = Titanium.App.Properties.getString('ipaddress');
	var def_port = Titanium.App.Properties.getString('port');
	var def_username = Titanium.App.Properties.getString('username');
	var def_password = Titanium.App.Properties.getString('password');
	
	for (var i = 0; i < connectionData.length; i++) { 
		var row = Titanium.UI.createTableViewRow(); 
		var label = Titanium.UI.createLabel(connTVRowLblProps);
		label.text = connectionData[i].label;
		
		textFields[i] = Titanium.UI.createTextField(connTVRowTextFieldProps); 
		
		if(connectionData[i].field == 'ipaddress') {
		    textFields[i].value = def_ipaddress;
		    textFields[i].passwordMask = false;
		    textFields[i].hintText = 'IP/DNS';
		}
		
		if(connectionData[i].field == 'port') {
		    textFields[i].value = def_port;
		    textFields[i].hintText = 'Type Port...';
		}
		
		if(connectionData[i].field == 'username') {
		    textFields[i].value = def_username;
		    textFields[i].hintText = 'Type User Name...';
		}
		
		if(connectionData[i].field == 'password') {
		    textFields[i].passwordMask = true;
		    textFields[i].value = def_password;
		    textFields[i].hintText = 'Type Password...';
		}
		row.add(label);
		row.add(textFields[i]);
		row.className = 'userinfo';
		connTblData.push(row);
	};
	
	var connectionInfoTableView = Ti.UI.createTableView(connectionInfoTableViewProps);
	
	connectionInfoTableView.data = connTblData;
	
	function saveConnectionInfo() { 
		// get the user name and password values here and save them using //Ti.App.Properties.setString()... but how??? 
		var ipaddress = textFields[0].value;
		var port = textFields[1].value;
		var username = textFields[2].value;
		var password = textFields[3].value;
		Ti.App.Properties.setString('ipaddress', ipaddress);
		Ti.App.Properties.setString('port', port);
		Ti.App.Properties.setString('username', username);
		Ti.App.Properties.setString('password', password);
		Ti.API.info('user and pass' + username + ' ' + password + ipaddress + port);
		// devices.getDevicesLive(populateDevicesDB);		
	};
	
//****DEVICES INFORMATION*********
	var tvDevicesHeader = Ti.UI.createLabel(tvDevicesHeaderProps);	

	
	// var tvInFloorPlanViewLbl = Ti.UI.createLabel(tvInFloorPlanViewLblProps);
	
	var populateDevicesBtn = Ti.UI.createButton(populateDevicesBtnProps);
	
	// Listen for click events.
	populateDevicesBtn.addEventListener('click', function() {
		saveConnectionInfo();
		devices.getDevicesLive(populateDevicesDB);
	});
	
	
	var tvDevicesTbl = Ti.UI.createTableView(tvDevicesTblProps);
	
	tvDevicesTbl.addEventListener('delete',function(e) {
		var s = e.section;
		db.deleteDevice(e.rowData.id);
	});
		
	function populateTvDevicesTbl(retData){
		var tvInListViewLbl = Ti.UI.createLabel(tvInListViewLblProps);
		var deviceTblData = [];
		
		var row2 = Ti.UI.createTableViewRow({
			height:50
		});
		row2.add(tvInListViewLbl);
		deviceTblData[0] = row2;
		
		for (var i = 0; i < retData.length; i++) {
			//add one because we have a header
			deviceTblData[i+1] = addDeviceTblRow(retData[i]);
		}
		tvDevicesTbl.setData(deviceTblData);		
	}
	
	function addDeviceTblRow(device) {
		var row = Ti.UI.createTableViewRow({
			height:50
		});

		//Create a Button.
		var moveDownBtn = Ti.UI.createButton({
			// height : 30,
			// width : 30,
			left : '85%',
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
			left : '93%',
			direction : 'up',
			address : device.deviceAddress,
			sortId : device.sortId,
			backgroundColor: 'transparent',
			image : '/images/glyphicons_213_up_arrow.png'
		});
		
		// Add to the parent view.
		row.add(moveUpBtn);
				
		var swInListView = Ti.UI.createSwitch(swInListViewProps);
		swInListView.value = device.showInListView;
		
		row.add(swInListView);
	
		swInListView.addEventListener('change', function(e) {
			//if switch on update inListView to true.  If switch off inListView = false
			if(e.value){
				db.updateDeviceShowInListView(device.deviceAddress, true);	
			}else{
				db.updateDeviceShowInListView(device.deviceAddress, false);	
			}
			
		});
				
		if (!device.deviceParent){
			//todo: section off by folder
		}
		
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
		var lblDeviceType = Ti.UI.createLabel(tvDeviceLblTypeProps);
		lblDeviceType.text = device.deviceType;
		row.add(lblDeviceType);
		
		var deviceLbl = Ti.UI.createLabel(tvDevicesLblProps);
		deviceLbl.text = device.displayName;
		row.add(deviceLbl);
		
		row.className = 'control';
		
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
	
	//Button to swap out the background on the FloorPlan view.
	// var f = Ti.App.Properties.getString("backgroundFilename");
	// var bgImage = null;
	// if (f != null && f != "") {
		// bgImage	= Titanium.Filesystem.getFile(f);
	// }
		
	// var addBackgroundBtn = Titanium.UI.createButton(addBackgroundBtnProps);
// 	
		// addBackgroundBtn.addEventListener('click',function() {		
		// Titanium.Media.openPhotoGallery({	
			// success:function(event) {
				// var image = event.media;
// 				
				// // create new file name and remove old
				// var filename = Titanium.Filesystem.applicationDataDirectory + "/" + new Date().getTime() + ".jpg";
				// Ti.App.Properties.setString("backgroundFilename", filename);
				// if (bgImage != null) {
					// bgImage.deleteFile();
				// }
				// bgImage = Titanium.Filesystem.getFile(filename);
				// bgImage.write(image);
			// },
			// cancel:function() {
// 		
			// },
			// error:function(error) {
			// }
		// });
	// });
// 		
	
	db.selectDevices(populateTvDevicesTbl);	
	
	settingsView.add(tvConnectionInfoHeaderLbl);	
	settingsView.add(connectionInfoTableView);
	settingsView.add(tvDevicesHeader);
	settingsView.add(tvDevicesTbl);
	settingsView.add(populateDevicesBtn);			
	// self.add(addBackgroundBtn);
	settingsView.add(closeBtn);
	
	return settingsView;
}

module.exports = SettingsView;
