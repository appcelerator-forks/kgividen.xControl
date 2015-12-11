/**
 * self-executing function to organize otherwise inline constructor code
 * @param  {Object} args arguments passed to the controller
 */
(function constructor(args) {

    var fakeData = require("/data/fakeData");
    fakeData.createFakeData();

    // use strict mode for this function scope
    'use strict';

    if (OS_IOS) {
        // open SplitWindow for iPad
        //if (Alloy.isTablet) {
            //$.splitWin.open(params);

            // open NavigationWindow for iPhone
        //} else {
        $.navWin.open();
        //}
    } else {
        Ti.API.debug("opening foldersCTRL!!!");
        $.foldersCtrl.getView().open();
    }

    // execute constructor with optional arguments passed to controller
})(arguments[0] || {});

//function onFolderWindowClose(e) {
//    Ti.API.debug("On window Close trigger!!!");
//    $.destroy();
//}




/**
 * event listener set via view for the select-event of the folders controller
 * @param  {Object} e Event
 */
function onSelect(e) {
    'use strict';

    // selected model passed with the event
    var model = e.model;

    var params = {
        model: model
    };

    if (OS_IOS) {
        params.navWin = $.navWin;
    }

    //create the devices controller with the model and get its view
    var win = Alloy.createController('settingsMenu/devices', params).getView();

    //open the window in the NavigationWindow for iOS
    if (OS_IOS) {
        $.navWin.openWindow(win);
    } else {
        win.open();   //simply open the window on top for Android (and other platforms)
    }
}

function onAddFolderClicked() {
    Ti.API.debug("onAddFolderClicked");
    var win = Alloy.createController("settingsMenu/addFolder", {
        parentController: $,
        callback: function (event) {
            win.close();
            addFolderCallback(event);
        }
    }).getView();

    if (OS_IOS) {
        $.navWin.openWindow(win);
    } else {
        win.open(); //simply open the window on top for Android (and other platforms)
    }
}


function addFolderCallback(event) {
    if (event.success) {
        addFolder(event.content);
    } else {
        Ti.API.debug("No Folder Added");
    }
}

function addFolder(content) {
    Ti.API.debug(content);
    var guid = Ti.Platform.createUUID();
    var model = {
        "name" : content,
        "displayName" : content,
        "address" : guid,
        "type" : "folder"
    };
    Alloy.createModel('Device', model).save({}, {
        success : function(model, response) {
            Ti.API.debug('success: ' + model.toJSON());
        },
        error : function(e) {
            Ti.API.error('error: ' + e.message);
            alert('Error saving new name ' + e.message);
        }
    });
}

function onEditFolderClicked(e) {
    Ti.API.debug("onEditFolderClicked");
    var item = e.section.getItemAt(e.itemIndex);

    var params = {
        parentController: $,
        item: item,
        callback: function (event) {
            win.close();
        }
    };

    if (OS_IOS) {
        params.navWin = $.navWin;
    }

    var win = Alloy.createController("settingsMenu/editFolder", params).getView();

    if (OS_IOS) {
        $.navWin.openWindow(win);
    } else {
        win.open(); //simply open the window on top for Android (and other platforms)
    }
}
