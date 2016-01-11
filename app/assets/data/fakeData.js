var createFakeData = function () {
    //Reset the data
    Ti.API.debug("Reset");

    Alloy.Collections.Device.fetch();
    var model;

    while (model = Alloy.Collections.Device.first()) {
        model.destroy({silent: true});
    }

    Alloy.Collections.DeviceInFolder.fetch();
    var model;

    while (model = Alloy.Collections.DeviceInFolder.first()) {
        model.destroy({silent: true});
    }

    Alloy.Collections.DeviceInView.fetch();
    var model;

    while (model = Alloy.Collections.DeviceInView.first()) {
        model.destroy({silent: true});
    }

    //*******START create fake data

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

    //Add the device into a VIEW (i.e. Favorites)
    model = {
        "DeviceId" : "1",
        "ViewId" : "1",
        "SortId" : 0
    };

    Alloy.createModel('DeviceInView', model).save({silent: true});
};

exports.createFakeData = createFakeData;