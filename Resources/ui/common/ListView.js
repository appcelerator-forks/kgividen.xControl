var ListView = function (props) {
	// todo: Could probably be passed in
	var osname = Ti.Platform.osname, height = Ti.Platform.displayCaps.platformHeight, width = Ti.Platform.displayCaps.platformWidth;
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 600 || height > 800));

	//*************PROPERTIES (Set from the ApplicationWindow.js)****************************
	//todo: There is probably a better way to pass these in.  Alloy?
	var deviceBtnProps = props.deviceBtnProps;
	var deviceSceneOnBtnProps = props.deviceSceneOnBtnProps;
	var deviceSceneOffBtnProps = props.deviceSceneOffBtnProps;
	var deviceSceneLabelProps = props.deviceSceneLabelProps;
	var deviceTableViewProps = props.deviceTableViewProps;
	var parentSeparatorProps = props.parentSeparatorProps;
	var deviceSliderProps = props.deviceSliderProps;
	var deviceSliderLabelProps = props.deviceSliderLabelProps;
	var deviceRowProps = props.deviceRowProps;
	var settingsViewProps = props.settingsViewProps;
	var openSettingsBtnProps = props.openSettingsBtnProps;
	var refreshBtnProps = props.refreshBtnProps;
	//***************END OF PROPERTIES********************

	var devices = require('Devices');
	var db = require('db');
	var _ = require('underscore-min')._;

	var self = Ti.UI.createView();

	var listOfUIDevices = []; //This is used for when we update the status of the devices we know what we need to update.

	var deviceTableView = Ti.UI.createTableView(deviceTableViewProps);

	//**********TABLE PULL TO REFRESH ***********************
	
	//todo: Need to move the width and stuff out of here into the application.js
	if (osname !== 'android'){
		var tableHeader = Ti.UI.createView({
			backgroundColor:"#e2e7ed",
			width:320,
			height:60
		});
		
		var statusLabel = Ti.UI.createLabel({
			text:"Pull to reload",
			left:55,
			width:200,
			bottom:30,
			height:"auto",
			color:"#576c89",
			textAlign:"center",
			font:{fontSize:13,fontWeight:"bold"},
			shadowColor:"#999",
			shadowOffset:{x:0,y:1}
		});
		
		var actInd = Titanium.UI.createActivityIndicator({
			left:20,
			bottom:13,
			width:30,
			height:30
		});
		
		tableHeader.add(statusLabel);
		tableHeader.add(actInd);
		
		deviceTableView.headerPullView = tableHeader;
		
		
		var pulling = false;
		var reloading = false;
		
		function beginReloading() {
			// just mock out the reload
			setTimeout(endReloading,2000);
		}
		
		function endReloading() {
			// simulate loading
			refreshInListView();
		
			// when you're done, just reset
			deviceTableView.setContentInsets({top:0},{animated:true});
			reloading = false;
			statusLabel.text = "Pull down to refresh...";
			actInd.hide();
		}
		
		deviceTableView.addEventListener('scroll',function(e) {
			var offset = e.contentOffset.y;
			if (offset <= -65.0 && !pulling && !reloading) {
				var t = Ti.UI.create2DMatrix();
				t = t.rotate(-180);
				pulling = true;
				statusLabel.text = "Release to refresh...";
			} else if (pulling && (offset > -65.0 && offset < 0) && !reloading ) {
				pulling = false;
				statusLabel.text = "Pull down to refresh...";
			}
		});
		
	
		deviceTableView.addEventListener('dragend',function(e) {
			if (pulling && !reloading) {
				reloading = true;
				pulling = false;
				actInd.show();
				statusLabel.text = "Reloading...";
				deviceTableView.setContentInsets({top:60},{animated:true});
				beginReloading();
			}
		});
	}else{
		
		// Create a Button.
		var refreshBtn = Ti.UI.createButton(refreshBtnProps);
		
		// Listen for click events.
		refreshBtn.addEventListener('click', function() {
			refreshInListView();
		});
		
		// Add to the parent view.
		self.add(refreshBtn);
		
	}


//************** END PULL TO REFRESH ************************
	function updateStatusOfDevicesOnView(xmlData) {
		try{
			var xml = xmlData.responseXML;
		}catch(e){
			alert('Data Error.  Please check the connection information.');
			return;	
		}
		if (xml == null){
			return;
		}
		var nodes = xml.documentElement.getElementsByTagName('node');
		for (var i = 0; i < nodes.length; i++) {
			var address = nodes.item(i).getAttribute('id');
			var status = nodes.item(i).getElementsByTagName('property').item(0).getAttribute('formatted');
			var statusValue = nodes.item(i).getElementsByTagName('property').item(0).getAttribute('value');
	
			//Get all of the elements that match this address.  i.e. button, slider, etc.
			var currentDevice = _.filter(listOfUIDevices,function(device){
				return device.address == address;
			});
			
			if (!currentDevice){
				continue;
			}
			
			//update each of the updated graphics with the correct image states or values.
			_.each(currentDevice, function(device){
				if (device.type == 'button') {
					if (status == 'On') {
						device.backgroundImage = deviceBtnProps.onImage;
					} else {
						device.backgroundImage = deviceBtnProps.offImage;
					}
				} else if (device.type == 'slider') {
					var level = statusValue / 255 * 100;
					device.value = level;				
				}
				
		 		if (device.type == 'label') {
					var level = statusValue / 255 * 100;
					device.text = Math.round(level);
				}
			});
		}
	}

	function showDevicesInListView() {
		//gets all the devices from the DB that are tagged as visible by the user in the settings view.
		db.getListViewDevices(showDevices);
	}

	function refreshInListView() {
		showDevicesInListView();
	}

	//show only the ones that are supposed to be shown in the list view by adding them each to a table view.
	function showDevices(devicesInListView) {
		var deviceTblData = [];
		if (devicesInListView != null && devicesInListView.length > 0) {
			for (var i = 0; i < devicesInListView.length; i++) {
				var deviceRow = Titanium.UI.createTableViewRow(deviceRowProps);
				if (devicesInListView[i].type =='Folder') {
					var parentSeparator = Ti.UI.createLabel(parentSeparatorProps);
					parentSeparator.text = devicesInListView[i].displayName;
					deviceRow.add(parentSeparator);
				} else if (devicesInListView[i].type == 'scene') {
					var data = {
						address : devicesInListView[i].address,
						name : devicesInListView[i].displayName
					};
					//create a scene row and push it on.
					var sceneLbl = createDeviceSceneLbl(data);					
					var sceneOnBtn = createDeviceSceneOnBtn(data);
					var sceneOffBtn = createDeviceSceneOffBtn(data);
					var deviceSliderAndLabel = createDeviceSlider(data);
					deviceRow.add(sceneLbl);
					deviceRow.add(sceneOnBtn);
					deviceRow.add(sceneOffBtn);

				} else {
					var data = {
						name : devicesInListView[i].displayName,
						address : devicesInListView[i].address
					};
					var deviceBtn = createDeviceButton(data);
					var deviceSliderAndLabel = createDeviceSlider(data);
					deviceRow.add(deviceBtn);
					deviceRow.add(deviceSliderAndLabel.slider);
					deviceRow.add(deviceSliderAndLabel.label);
				}
				deviceTblData.push(deviceRow);
			}
			deviceTableView.data = deviceTblData;
			self.add(deviceTableView);
			devices.getCurrentStatusOfDevices(updateStatusOfDevicesOnView);
		} else {
			alert("No Devices Found!  Please check the connection settings.");
		}
	}

	//Let's create a device button to add to the table view
	var createDeviceButton = function(data) {
		var deviceBtn = Titanium.UI.createButton(deviceBtnProps);
		deviceBtn.title = data.name;
		deviceBtn.address = data.address;

		listOfUIDevices.push(deviceBtn);

		deviceBtn.addEventListener('click', function(e) {
			devices.getStatusThenToggleDevice(updateStatusOfDevicesOnView, deviceBtn.address);
		});
		
		return deviceBtn;
	}
	
	//Let's create a device slider to add to the table view
	var createDeviceSlider = function(data) {

		var deviceSliderLabel = Titanium.UI.createLabel(deviceSliderLabelProps);
		deviceSliderLabel.type = 'label';
		deviceSliderLabel.address = data.address;
		//use the default for android.  (todo: move this to a view setting)
		if(osname == 'android'){
			delete deviceSliderProps.thumbImage;			
		}
		var deviceSlider = Titanium.UI.createSlider(deviceSliderProps);
		deviceSlider.address = data.address;

		deviceSlider.addEventListener('touchend', function(e) {
			deviceSliderLabel.text = Math.round(e.source.value);
			Ti.API.info('Touch ended: ' + e.source.value);
			devices.setDeviceValue(updateStatusOfDevicesOnView, e);
		});

		listOfUIDevices.push(deviceSlider);
		listOfUIDevices.push(deviceSliderLabel);

		var sliderAndLabel = ({
			slider : deviceSlider,
			label : deviceSliderLabel
		});

		return sliderAndLabel;
	}
	
	var createDeviceSceneLbl = function(data) {
		var sceneLbl = Titanium.UI.createLabel(deviceSceneLabelProps);
		sceneLbl.text = data.name;
		listOfUIDevices.push(sceneLbl);
	
		return sceneLbl;
	}
	
	//Let's create a scene button to add to the table view
	var createDeviceSceneOnBtn = function(data) {
		var sceneBtn = Titanium.UI.createButton(deviceSceneOnBtnProps);
		listOfUIDevices.push(sceneBtn);

		sceneBtn.addEventListener('click', function(e) {
			devices.sceneOn(updateStatusOfDevicesOnView, data.address);
		});
		
		return sceneBtn;
	}
	
	var createDeviceSceneOffBtn = function(data) {
		var sceneBtn = Titanium.UI.createButton(deviceSceneOffBtnProps);
		listOfUIDevices.push(sceneBtn);

		sceneBtn.addEventListener('click', function(e) {
			devices.sceneOff(updateStatusOfDevicesOnView, data.address);
		});
		
		return sceneBtn;
	}
	
	//Open Settings
	var openSettingsBtn = Ti.UI.createButton(openSettingsBtnProps);

	openSettingsBtn.addEventListener('click', function(e) {
		openSettings();
	});

	function openSettings() {	
		self.remove(deviceTableView);
		var SettingsView = SettingsView = require('ui/common/SettingsView');
		var settingsView = new SettingsView({settingsViewProps: settingsViewProps},self);
		self.add(settingsView);
	}

	self.add(openSettingsBtn);

	//Refresh the view when we get here again.
	self.addEventListener('myFocus', function(e) {
		refreshInListView();
	});

	self.addEventListener('myBlur', function(e) {
		self.remove(deviceTableView);
	});


	//kick everything off here.
	var hasRunBefore = Titanium.App.Properties.getString('hasRunBefore');
	if (!hasRunBefore){
		openSettings();
	}else{
		showDevicesInListView();
	}

	return self;
}

module.exports = ListView;