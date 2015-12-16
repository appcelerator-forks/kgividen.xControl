//TODO DEBUG
//var data = {"method":"http","server":"192.168.111.4","port":"80","username":"kgividen","password":"xabler"};
//var data = {"method":"https","server":"160.7.236.184","port":"3005","username":"kgividen","password":"xabler"};
//Ti.API.info(data);
//Ti.App.Properties.setObject('conn_current', data);
//Ti.App.Properties.setObject('conn_Remote', data);
//Ti.App.Properties.setObject('conn_Local', data);

//***************************MENU STUFF ***************************
function createSideMenu(sections, controller) {
    var s = Ti.UI.createTableViewSection();
    //This adds the rows to the menu
    _.each(sections, function(section) {
        if(section.header){
            s.headerTitle = section.title;
        }else {
            s.add(Alloy.createController(controller, section).getView());
        }
    });

    return s;
}

//This is what happens when a menu row is selected.
function rowSelect(e) {
    if(osname =="android") {
        var dsScrollView = $.ds.contentview.getChildren()[0].getChildren()[0];

    }
    var dsScrollView = (osname === "android") ? $.ds.contentview.getChildren()[0].getChildren()[1] : $.ds.contentview.getChildren()[0].getChildren()[0];
    switch(e.row.action) {
        case "favorites":
            dsScrollView.scrollToView(VIEW_ID_FAVORITES);
            break;
        case "lights":
            dsScrollView.scrollToView(VIEW_ID_LIGHTS);
            break;
        case "scenes":
            dsScrollView.scrollToView(VIEW_ID_SCENES);
            break;
        case "cameras":
            $.destroy();
            Alloy.createController("camerasContainer").getView().open();
            $.win.close();
            break;
        case "settings":
            $.destroy();
            Alloy.createController("settings").getView().open();
            $.win.close();
            break;
        case "updateDevices":
            $.destroy();
            Alloy.createController('/settingsMenu/index').getView().open();
            $.win.close();
            break;
        case "debug":
            $.destroy();
            Alloy.createController("debug").getView().open();
            $.win.close();
            break;
        default:
            dsScrollView.scrollToView(VIEW_ID_FAVORITES);
    }
}

//**************** RIGHT MENU ****************
var rightMenu = [
    {
        title: 'Menu',
        header: true
    },{
        title: 'Network Settings',
        type: 'menu',
        icon: 'fa-gear',
        iconColor: '#999',
        action: 'settings'
    },{
        title: 'Update/Edit Devices',
        type: 'menu',
        icon: 'fa-lightbulb-o',
        iconColor: '#999',
        action: 'updateDevices'
    }
];

if(xDebug){
    rightMenu.push({
        title: 'Debug Window',
            type: 'menu',
        icon: 'fa-gear',
        iconColor: '#999',
        action: 'debug'
    });
}

var rightData = [];
rightData[0] = createSideMenu(rightMenu, "menurow");
$.ds.rightTableView.data = rightData;
//**************** END RIGHT MENU ****************

//**************** LEFT MENU ****************


var leftMenu = [
    {
        title: 'Menu',
        header: true
    },{
        title: 'Favorites',
        type: 'menu',
        icon: 'fa-heart-o',
        iconColor: '#999',
        action: 'favorites'
    },{
        title: 'Lights',
        type: 'menu',
        icon: 'fa-lightbulb-o',
        iconColor: '#999',
        action: 'lights'
    },{
        title: 'Scenes',
        type: 'menu',
        icon: 'fa-adjust',
        iconColor: '#999',
        action: 'scenes'
    },{
        title: 'Cameras',
        type: 'menu',
        icon: 'fa-camera',
        iconColor: '#999',
        action: 'cameras'
    }
];


var leftData = [];
leftData[0] = createSideMenu(leftMenu, "menurow");
$.ds.leftTableView.data = leftData;
//**************** END LEFT MENU ****************


// Set row title highlight colour (left table view)
var storedRowTitle = null;
$.ds.leftTableView.addEventListener('touchstart', function(e) {
    if(e.row){
        storedRowTitle = e.row.sectionTitle;
        storedRowTitle.color = "#FFF";
    }
});
$.ds.leftTableView.addEventListener('touchend', function(e) {
    if(storedRowTitle){
        storedRowTitle.color = "#666";
    }
});
$.ds.leftTableView.addEventListener('scroll', function(e) {
    if (storedRowTitle != null)
        storedRowTitle.color = "#666";
});

Ti.App.addEventListener("sliderToggled", function(e) {
    if (e.direction == "right") {
        $.ds.leftMenu.zIndex = 2;
        $.ds.rightMenu.zIndex = 1;
    } else if (e.direction == "left") {
        $.ds.leftMenu.zIndex = 1;
        $.ds.rightMenu.zIndex = 2;
    }
});

// Swap views on menu item click
$.ds.leftTableView.addEventListener('click', function selectRow(e) {
    rowSelect(e);
    $.ds.toggleLeftSlider();
});
$.ds.rightTableView.addEventListener('click', function selectRow(e) {
    rowSelect(e);
    $.ds.toggleRightSlider();
});

// ***************************END MENU STUFF***************************

function startUI(){
    if (osname == "ios") {
        $.win.open({
            transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
        });
    } else {
        // make sure Android doesn't close on the back button
        var exitMsg = Ti.UI.createAlertDialog();
        exitMsg.message = 'Exit?';
        exitMsg.buttonNames = ['No','Yes'];
        exitMsg.cancel = 0;

        exitMsg.addEventListener('click', function(e) {
            if (e.index == 1) {
                var activity = Titanium.Android.currentActivity;
                activity.finish();
            }
        });

        $.win.add(exitMsg);

        $.win.addEventListener('android:back',function(e) {
            exitMsg.show(); // show the leaving dialog
            return false;
        });

        $.win.addEventListener('open', function () {
            $.win.activity.actionBar.hide();
        });

        $.win.open();
    }

    $.win.addEventListener('close', function(){
        $.destroy();
    });

    Ti.Gesture.addEventListener('orientationchange', function() {
        $.ds.handleRotation();
    });

    //Empty the current contentView
    //$.ds.contentview.removeAllChildren();
    $.ds.contentview.add(Alloy.createController("devices").getView());

    //tmp
    //Alloy.createController("camerasContainer").getView().open();
    //$.win.close();
}

if(Ti.App.Properties.getObject('conn_current')) startUI(); //starts here



