//ISY Rest Calls
	var restCall = require('RestCall');
	
	exports.deviceOff = function(callback,address) {
		// Ti.API.info('Fire Address: ' + address);
		var encodedAddress = Ti.Network.encodeURIComponent(address);
		restCall.doRestCall(callback, 'nodes/' + encodedAddress + '/cmd/DOF', '');
	}
	exports.deviceOn = function(callback,address,level) {
		// alert('Fire this: ' + address);
		Ti.API.info('Fire Address: ' + address);
		var encodedAddress = Ti.Network.encodeURIComponent(address);
		restCall.doRestCall(callback, 'nodes/' + encodedAddress + '/cmd/DON/' + level, '');
	}
	exports.deviceFastOn = function(callback,address,callback2) {
		var data = {};
		data.address = address;
		//todo: this is a little hokey...we should refactor this.  It's used to pass the second call back from the ToggleDevice and will be the updateStatusOfDevicesOnView function from the list view
		data.callback = callback2; 
		// alert('Fire this: ' + address);
		Ti.API.info('Fire Address: ' + data.address);
		var encodedAddress = Ti.Network.encodeURIComponent(data.address);
		restCall.doRestCall(callback, 'nodes/' + encodedAddress + '/cmd/DFON', data);
	}
	exports.deviceFastOff = function(callback,address, callback2) {
		var data = {};
		data.address = address;
		//todo: this is a little hokey...we should refactor this.  It's used to pass the second call back from the ToggleDevice and will be the updateStatusOfDevicesOnView function from the list view
		data.callback = callback2;
		// alert('Fire this: ' + address);
		Ti.API.info('Fire Address: ' + data.address);
		var encodedAddress = Ti.Network.encodeURIComponent(data.address);
		restCall.doRestCall(callback, 'nodes/' + encodedAddress + '/cmd/DFOF', data);
	}
	//These aren't currently used
	// var deviceIncreaseBright = function(address) {
		// // alert('Fire this: ' + address);
		// Ti.API.info('Fire Address: ' + address);
		// var encodedAddress = Ti.Network.encodeURIComponent(address);
		// restCall.doRestCall('nodes/' + encodedAddress + '/cmd/BRT');
	// }
	// var deviceDecreaseBright = function(address) {
		// // alert('Fire this: ' + address);
		// Ti.API.info('Fire Address: ' + address);
		// var encodedAddress = Ti.Network.encodeURIComponent(address);
		// restCall.doRestCall('nodes/' + encodedAddress + '/cmd/BRT');
	// }
	// var deviceBeginManDim = function(address) {
		// // alert('Fire this: ' + address);
		// Ti.API.info('Fire Address: ' + address);
		// var encodedAddress = Ti.Network.encodeURIComponent(address);
		// restCall.doRestCall('nodes/' + encodedAddress + '/cmd/BMAN');
	// }
	// var deviceStopManDim = function(address) {
		// // alert('Fire this: ' + address);
		// Ti.API.info('Fire Address: ' + address);
		// var encodedAddress = Ti.Network.encodeURIComponent(address);
		// restCall.doRestCall('nodes/' + encodedAddress + '/cmd/SMAN');
	// }
	exports.deviceGetStatus = function(callback,address,callback2) {
		var data = {};  //todo: this is a little hokey...we should refactor this. 
		data.address = address;
		data.callback = callback2;
		var encodedAddress = Ti.Network.encodeURIComponent(data.address);		
		restCall.doRestCall(callback,'status/' + encodedAddress, data);
	}
	exports.getDevicesStatusXML = function(callback) {
		restCall.doRestCall(callback, 'status', '');
	}