var CONN_REMOTE = 'Remote';
var CONN_LOCAL = 'Local';
var NETWORK_BTN_REMOTE_TITLE = "Remote Connection Enabled";
var NETWORK_BTN_LOCAL_TITLE = "Local Connection Enabled";

var currentNetworkType = Titanium.App.Properties.getString('currentNetworkType') || CONN_LOCAL;

function getConnectionInfo(){
    var connectionInfo = Titanium.App.Properties.getObject('conn_' + currentNetworkType) || {};
    $.changeNetworkBtn.title = (currentNetworkType == CONN_REMOTE) ? NETWORK_BTN_REMOTE_TITLE : NETWORK_BTN_LOCAL_TITLE;;
    $.server.value = connectionInfo.server || '';
    $.method.value = connectionInfo.method || '';
    $.port.value = connectionInfo.port || '';
    $.username.value = connectionInfo.username || '';
    $.password.value = connectionInfo.password || '';
}


function saveConnectionInfo(){
    //todo: validate form
    data = {
        'server' : $.server.value || '',
        'method' :$.method.value || 'http',
        'port' : $.port.value || '80',
        'username' : $.username.value || '',
        'password' : $.password.value || ''
    };
    Ti.API.info("conn_info: " + JSON.stringify(data));
    Ti.App.Properties.setObject('conn_' + currentNetworkType, data);
    Ti.App.Properties.setObject('conn_current', data);
    Ti.App.Properties.setString('currentNetworkType',currentNetworkType);
    device.init();  //renews the connection information
}


//LISTENERS
$.closeBtn.addEventListener('click', function () {
    saveConnectionInfo();
    Alloy.createController("index").getView().open();
    $.settingsWin.close();
});

$.clearData.addEventListener('click', function () {
    Ti.API.info("DATA CLEARED!");
    var deviceCol = Alloy.Collections.device;
    deviceCol.fetch();
    var model;

    while (model = deviceCol.first()) {
        model.destroy({silent: true});
    }
    Alloy.Collections.device.reset({silent: true});
    Ti.App.Properties.setObject('conn_' + CONN_REMOTE, {});
    Ti.App.Properties.setObject('conn_' + CONN_LOCAL, {});
    Ti.App.Properties.setObject('conn_current', {});
    $.server.value = '';
    $.method.value = '';
    $.port.value = '';
    $.username.value = '';
    $.password.value = '';
});

$.getListOfDevicesBtn.addEventListener('click', function () {
    saveConnectionInfo();
    Alloy.Collections.deviceInView.fetch();
    Alloy.Globals.deviceInViewJSON = Alloy.Collections.deviceInView.toJSON(); //So we can access it in the tableViewRow
    Alloy.createController('settingsDeviceList').getView().open();
});

$.changeNetworkBtn.addEventListener('click', function(e) {
    saveConnectionInfo(); //save before we switch.
    //Toggle the network Type
    if(currentNetworkType == "Remote"){
        currentNetworkType = CONN_LOCAL;
        $.changeNetworkBtn.title = NETWORK_BTN_LOCAL_TITLE;
    }else{
        currentNetworkType = CONN_REMOTE;
        $.changeNetworkBtn.title = NETWORK_BTN_REMOTE_TITLE;
    }
    getConnectionInfo();
});


$.settingsWin.addEventListener("close", function(){
    $.destroy();
});
getConnectionInfo();

var defaultViewData = [
    {
        "name" : "Favorites"
    },
    {
        "name" : "Lighting"

    },
    {
        "name" : "Scenes"
    }
];
Alloy.Collections.view.reset(defaultViewData);
_.each(defaultViewData, function (item) {
    var model = Alloy.createModel('View', item);
    model.save({silent: true});
});
Alloy.Collections.view.fetch();
Ti.API.info("Views: " + JSON.stringify(Alloy.Collections.view));