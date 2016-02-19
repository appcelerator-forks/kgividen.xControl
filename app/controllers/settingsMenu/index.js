'use strict';

var args = arguments[0] || {};

/**
 * self-executing function to organize otherwise inline constructor code
 * @param  {Object} args arguments passed to the controller
 */
(function constructor(args) {
    // execute constructor with optional arguments passed to controller

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
        //Ti.API.debug("opening foldersWin!!!");
        $.win.open();
    }

})(arguments[0] || {});

/**
 * event listener set via view for when the user clicks the close window button.
 * @param  {Object} e Event
 */

function closeSettingsBtnClicked(e) {
    if (OS_IOS) {
        $.navWin.close();
    } else {
        $.win.close();
    }
    $.destroy();
}

function loadFoldersCallback(e) {
//create the devices controller with the model and get its view
    var params= {
        "viewId": e.index,
        "viewName" : e.row.viewName,
        "navWin" : $.navWin
    };
    var win = Alloy.createController('settingsMenu/folders', params).getView();

//open the window in the NavigationWindow for iOS
    if (OS_IOS) {
        $.navWin.openWindow(win);
    } else {
        win.open();   //simply open the window on top for Android (and other platforms)
    }
}


$.indexList.init({"loadFoldersCallback":loadFoldersCallback});
