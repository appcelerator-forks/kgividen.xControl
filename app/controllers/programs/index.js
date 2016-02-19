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
        $.navWin.open();
    } else {
        $.win.open();
    }

})(arguments[0] || {});

/**
 * event listener set via view for when the user clicks the close window button.
 * @param  {Object} e Event
 */

function closeProgramsBtnClicked(e) {
    if (OS_IOS) {
        $.navWin.close();
    } else {
        $.win.close();
    }
    $.destroy();
}

function loadFoldersCallback(e) {
	Ti.API.info("e: " + JSON.stringify(e));
//create the devices controller with the model and get its view
    var params= {
    	"parentId" : e.row.folderId,
        "navWin" : $.navWin
    };
    var win = Alloy.createController('programs/programs', params).getView();

//open the window in the NavigationWindow for iOS
    if (OS_IOS) {
        $.navWin.openWindow(win);
    } else {
        win.open();   //simply open the window on top for Android (and other platforms)
    }
}


$.programFolders.init({
		"loadFoldersCallback":loadFoldersCallback,
		"navWin":$.navWin
	});
