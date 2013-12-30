var DATABASE_NAME = 'validControl';

exports.createDb = function() {
	Ti.Database.install('validControl.sqlite', DATABASE_NAME);
};

exports.clearDb = function() {
	var db = Ti.Database.open(DATABASE_NAME);
	db.execute('DELETE FROM devices');
	db.close();
}
exports.selectDevices = function(callback, data){
	var retData = [];
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('SELECT * FROM devices ORDER BY sortId');
	while (rows.isValidRow()) {
		retData.push({
			id:rows.fieldByName('id'), 
			sortId:rows.fieldByName('sortId'),
			deviceName:rows.fieldByName('name'),
			displayName:rows.fieldByName('displayName'),
			deviceAddress:rows.fieldByName('address'),
			showInListView:rows.fieldByName('showInListView'),	
			showInFloorPlanView:rows.fieldByName('showInFloorPlanView'),	
			deviceType:rows.fieldByName('type'),
			deviceParent:rows.fieldByName('parent'),		
		});
		rows.next();
	}
	db.close();
	callback(retData, data);
}

exports.selectArrayOfDeviceAddress = function(){
	var retData = [];
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('select * from devices');
	while (rows.isValidRow()) {
		retData.push(rows.fieldByName('address'));
		rows.next();
	}
	db.close();
	return retData;	
}

//todo:  Finish update
exports.updateDevice = function(name,sortId,displayName,address,showInListView,showInFloorPlanView,type,parent) { 
	var retData = [];
	var db = Ti.Database.open(DATABASE_NAME);
	db.execute('UPDATE devices SET name=?,sortId=?,displayName=?,showInListView=?,showInFloorPlanView=?,type=?,parent=? WHERE address=?',name,sortId,displayName,showInListView,showInFloorPlanView,type,parent,address);
	db.close();
	return retData;
};

exports.updateDeviceSortId = function(address, sortId){
	var db = Ti.Database.open(DATABASE_NAME);
	db.execute('UPDATE devices SET sortId=? WHERE address=?',sortId,address);
	db.close();		
}

exports.updateDeviceShowInListView = function(address, showInListView){
	var db = Ti.Database.open(DATABASE_NAME);
	db.execute('UPDATE devices SET showInListView=? WHERE address=?',showInListView,address);
	db.close();
}

exports.updateDeviceShowInFloorPlanView = function(address, showInFloorPlanView){
	var db = Ti.Database.open(DATABASE_NAME);
	db.execute('UPDATE devices SET showInFloorPlanView=? WHERE address=?',showInFloorPlanView,address);
	db.close();
}

exports.addDevice = function(name,sortId,displayName,address,showInListView,showInFloorPlanView,type,parent) {
	var db = Ti.Database.open(DATABASE_NAME);
	db.execute('INSERT INTO devices (name,sortId,displayName,address,showInListView,showInFloorPlanView,type,parent) VALUES (?,?,?,?,?,?,?,?)', name,sortId,displayName,address,showInListView,showInFloorPlanView,type,parent);
	db.close();
};


exports.deleteDevice = function(id) {
	var db = Ti.Database.open(DATABASE_NAME);
	db.execute('DELETE FROM devices WHERE id = ?', id);
	db.close();
};



exports.getListViewDevices = function(callback){	
	var devicesInListView = [];
	var db = Ti.Database.open(DATABASE_NAME);
	// var rows = db.execute('SELECT * FROM sqlite_master WHERE type="table"');
	// Ti.API.info(rows);
	var rows = db.execute('SELECT * FROM devices WHERE showInListView = ? ORDER BY sortId', true);
	while (rows.isValidRow()) {
		devicesInListView.push({
			name : rows.fieldByName('address'),
			sortId : rows.fieldByName('sortId'),
			displayName : rows.fieldByName('displayName'),
			address : rows.fieldByName('address'),
			type : rows.fieldByName('type'),
			parent : rows.fieldByName('parent')
		});
		rows.next();
	}
	db.close();
	
	callback(devicesInListView);
}