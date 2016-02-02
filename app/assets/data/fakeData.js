var deleteFakeData = function () {
	//Reset the data
    Ti.API.debug("Reset");

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

    Alloy.Collections.FolderInView.fetch();
    var model;

    while (model = Alloy.Collections.FolderInView.first()) {
        model.destroy({silent: true});
    }

};

var createFakeData = function () {
    
    //*******START create fake data
    createFakeFolders();
    createFakeDevices();
	linkDevicesAndFolders();
	linkFoldersAndViews();
};

var createFakeFolders = function () {
	//Create a folder
    var model = {
        "name" : "Kitchen Folder",
        "displayName" : "Kitchen Folder",
        "address" : "29764",
        "type" : "folder"
    };
    Alloy.createModel('Device', model).save({silent: true});

    var model = {
        "name" : "Dining Room Folder",
        "displayName" : "Dining Room Folder",
        "address" : "123",
        "type" : "folder"
    };
    Alloy.createModel('Device', model).save({silent: true});
    
    var model = {
        "name" : "Blah Folder",
        "displayName" : "Blah Folder",
        "address" : "222",
        "type" : "folder"
    };
    Alloy.createModel('Device', model).save({silent: true});
};

var createFakeDevices = function () {
	//Create a device
    var model = {
        "name" : "Dining Light",
        "displayName" : "Dining Light",
        "address" : "12323234",
        "type" : "light",
        "parent" : ""
    };

    Alloy.createModel('Device', model).save({silent: true});

    var model = {
        "name" : "Dining L2",
        "displayName" : "Dining L2",
        "address" : "111111",
        "type" : "light",
        "parent" : ""
    };
    Alloy.createModel('Device', model).save({silent: true});

    var model = {
        "name" : "Kitchen Light",
        "displayName" : "Kitchen Light",
        "address" : "22222",
        "type" : "light",
        "parent" : ""
    };
    Alloy.createModel('Device', model).save({silent: true});

    var model = {
        "name" : "Kitchen Scene",
        "displayName" : "Kitchen Scene",
        "address" : "111",
        "type" : "scene",
        "parent" : ""
    };
    Alloy.createModel('Device', model).save({silent: true});
};

var linkDevicesAndFolders = function () {
    //Add a device into a Folder
    var model = {
        "DeviceAddress" : "12323234",
        "FolderAddress" : "123",         //dining
        "SortId" : 1
    };
    Alloy.createModel('DeviceInFolder', model).save({silent: true});

    var model = {
        "DeviceAddress" : "111111",
        "FolderAddress" : "123",       //dining
        "SortId" : 0
    };
    Alloy.createModel('DeviceInFolder', model).save({silent: true});
    
    var model = {
        "DeviceAddress" : "1",
        "FolderAddress" : "123",       //dining
        "SortId" : 0
    };
    Alloy.createModel('DeviceInFolder', model).save({silent: true});

    //Add kitchen light
    var model = {
        "DeviceAddress" : "22222",
        "FolderAddress" : "29764",
        "SortId" : 0
    };
    Alloy.createModel('DeviceInFolder', model).save({silent: true});
};

var linkFoldersAndViews = function () {
    //Add folder to favorites view
    var model = {
        "FolderAddress" : "123",         //dining
        "ViewId" : 0,         //favorites
        "SortId" : 0
    };
    Alloy.createModel('FolderInView', model).save({});
    
    var model = {
        "FolderAddress" : "29764",	//Kitchen Folder
        "ViewId" : 0,         	//favorites
        "SortId" : 1
    };
    Alloy.createModel('FolderInView', model).save({});
	
	//Add Folders to lighting view
	var model = {
        "FolderAddress" : "123",         //dining
        "ViewId" : 1,         //lighting view
        "SortId" : 0
    };
    Alloy.createModel('FolderInView', model).save({});
    
	var model = {
        "FolderAddress" : "222",         //dining
        "ViewId" : 1,         //lighting view
        "SortId" : 1
    };
    Alloy.createModel('FolderInView', model).save({});
};

exports.createFakeData = createFakeData;
exports.deleteFakeData = deleteFakeData;
exports.createFakeDevices = createFakeDevices;
exports.createFakeFolders = createFakeFolders;
exports.linkDevicesAndFolders = linkDevicesAndFolders;
exports.linkFoldersAndViews = linkFoldersAndViews;