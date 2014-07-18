var xhr = require('/qxhr');
var baseURL;
var connection = {};
//TODO INIT connection so it loads it for ever instance.


exports.init = function() {
    //This is the saved connection object set by the user
    var conn = Ti.App.Properties.getObject('conn_current');

    if (!conn) {
        alert('Connection Error! Please check the connection information. No connection info set.');
        Alloy.createController("settings").getView().open();
    } else {
        baseURL = conn.method + '://' + conn.server + ':' + conn.port + '/rest/';
        var authString = conn.username + ':' + conn.password;
        var b64encodedAuthString = Ti.Utils.base64encode(authString.toString());

        //This is the connection we'll send to xhr
        connection.headers = [
            {
                name: 'Accept',
                value: 'application/xml'},
            {
                name: 'Authorization',
                value: 'Basic ' + b64encodedAuthString
            }

        ];

        connection.connectiontype = 'GET';
        connection.username = conn.username; //This is so we can throw an error and let them know what the user was.
    }
};


// "INTERFACE" calls.  These are calls that all hardware devices will have.
exports.setLevel = function (address, l){
    var level = Math.round(l / 100 * 255);
    if (level == 0) {
        return deviceOff(address);
    } else {
        return deviceOn(address, level);
    }
};

exports.toggle = function (address){
    return deviceGetStatus(address).then(function (data){
        Ti.API.info(data);
        var deviceStatus = processDeviceStatusXML(data);
        Ti.API.info('status is ToggleDevice: ' + deviceStatus + ' Address of device: ' + address);
        if (deviceStatus == 'On') {
            deviceFastOff(address);
        } else {
            deviceFastOn(address);
        }
    });
};

//Should be in the format of
//[{address: "adress of device",
// level: "level of device"}]
exports.getAllDevicesStatus = function(){
    return getAllDevicesStatus();
};


exports.getListOfDevices = function(){
    return getListOfDevices();
};

//HELPER METHODS
function getAllDevicesStatus(){
    //We need this delay cause the response can come back faster than when it's updated by a toggle.  i.e. The rest will update but not the one that toggled it.
    return delayed(1000)
        .then(devicesGetStatus)
        .then(function(data){
            var deferred = Q.defer();
            // var delay = Q.delay();
            var xml = Ti.XML.parseString(data);
            var nodes = xml.documentElement.getElementsByTagName('node');
            var nodesJSON = convertNodesStatusToJson(nodes);
            //get all the nodes and addresses into a nice little array
            var nodesByAddressAndStatus = [];
            _.each(nodesJSON, function (item) {
                var itemTmp = {};
                itemTmp.address = item.id;
                itemTmp.level = Math.round(item.level / 255 * 100);
                nodesByAddressAndStatus.push(itemTmp);
            });
            deferred.resolve(nodesByAddressAndStatus);
            return deferred.promise;
        });
}

function delayed(ms) {
    var defer = Q.defer();
    setTimeout(defer.resolve, ms);
    return defer.promise;
}

//This should return something like this.  Basically it's a list of folders and then the objects in those folders.
//[{"name":"Back Bed and Bath","id":"8598"},{"id":"20 93 AA 1","name":"Bathroom","parent":"8598","type":"light"},{"id":"20 A8 14 1","name":"Baby Room","parent":"8598","type":"light"},{"id":"20 AF 5F 1","name":"Office","parent":"8598","type":"light"},{"id":"26 88 8D 1","name":"Baby Light On","parent":"8598","type":"light"},{"id":"26 88 8D 2","name":"Baby Light Read","parent":"8598","type":"light"},{"id":"26 88 8D 3","name":"Baby Light Bedtime","parent":"8598","type":"light"},{"id":"26 88 8D 4","name":"Baby Light Very Dim","parent":"8598","type":"light"}]
function getListOfDevices(){
//    var newArray = [{"name":"Kitchen","address":"29763","sortId":0,"type":"folder"},{"name":"Backyard Floods","parent":"29763","type":"light","sortId":1,"address":"20 88 48 1"},{"name":"Kitchen 3way","parent":"29763","type":"light","sortId":2,"address":"20 91 DD 1"},{"name":"Kitchen Sink","parent":"29763","type":"light","sortId":3,"address":"20 95 1D 1"},{"name":"Patio","parent":"29763","type":"light","sortId":4,"address":"20 A8 FC 1"},{"name":"Dining Area","parent":"29763","type":"light","sortId":5,"address":"20 AE 83 1"},{"name":"Kitchen Under Cabinets","parent":"29763","type":"light","sortId":6,"address":"20 B1 50 1"},{"name":"Kitchen","parent":"29763","type":"light","sortId":7,"address":"20 B2 AF 1"},{"name":"Kitchen Butlers Pantry","parent":"29763","type":"light","sortId":8,"address":"20 B2 B 1"},{"name":"Basement","address":"24703","sortId":9,"type":"folder"},{"name":"Basement Hall 4way","parent":"24703","type":"light","sortId":10,"address":"20 91 CF 1"},{"name":"Basement Stairs 3way","parent":"24703","type":"light","sortId":11,"address":"20 91 D4 1"},{"name":"Basement Hall","parent":"24703","type":"light","sortId":12,"address":"20 91 E1 1"},{"name":"Basement Stairs","parent":"24703","type":"light","sortId":13,"address":"20 98 62 1"},{"name":"Basement Great Room","parent":"24703","type":"light","sortId":14,"address":"20 A7 62 1"},{"name":"Basement Hall 4way","parent":"24703","type":"light","sortId":15,"address":"20 B1 CF 1"},{"name":"Basement Door-Opened","parent":"24703","type":"light","sortId":16,"address":"21 41 DF 1"},{"name":"Basement Door-Closed","parent":"24703","type":"light","sortId":17,"address":"21 41 DF 2"},{"name":"Basement-Sensor","parent":"24703","type":"light","sortId":18,"address":"21 58 C8 1"},{"name":"Master Bedroom","address":"52046","sortId":19,"type":"folder"},{"name":"Master Main Light","parent":"52046","type":"light","sortId":20,"address":"20 91 D2 1"},{"name":"Master Closet","parent":"52046","type":"light","sortId":21,"address":"20 92 B 1"},{"name":"Master Bay Window","parent":"52046","type":"light","sortId":22,"address":"20 AD EA 1"},{"name":"Kent's Reading Light","parent":"52046","type":"light","sortId":23,"address":"22 14 CE 1"},{"name":"Kent Arm","parent":"52046","type":"light","sortId":24,"address":"22 14 CE 3"},{"name":"22.14.CE.B","parent":"52046","type":"light","sortId":25,"address":"22 14 CE 4"},{"name":"22.14.CE.C","parent":"52046","type":"light","sortId":26,"address":"22 14 CE 5"},{"name":"Kent's All Off","parent":"52046","type":"light","sortId":27,"address":"22 14 CE 6"},{"name":"Rhonda's Reading Light","parent":"52046","type":"light","sortId":28,"address":"22 17 46 1"},{"name":"Rhonda Arm","parent":"52046","type":"light","sortId":29,"address":"22 17 46 3"},{"name":"22.17.46.B","parent":"52046","type":"light","sortId":30,"address":"22 17 46 4"},{"name":"22.17.46.C","parent":"52046","type":"light","sortId":31,"address":"22 17 46 5"},{"name":"Rhonda's All Off","parent":"52046","type":"light","sortId":32,"address":"22 17 46 6"},{"name":"Mudroom","address":"16894","sortId":33,"type":"folder"},{"name":"Mudroom","parent":"16894","type":"light","sortId":34,"address":"20 91 E3 1"},{"name":"Mudroom 3way","parent":"16894","type":"light","sortId":35,"address":"20 A5 34 1"},{"name":"Mudroom Arm","parent":"16894","type":"light","sortId":36,"address":"22 15 F3 3"},{"name":"22.15.F3.B","parent":"16894","type":"light","sortId":37,"address":"22 15 F3 4"},{"name":"22.15.F3.C","parent":"16894","type":"light","sortId":38,"address":"22 15 F3 5"},{"name":"Mudroom All Off","parent":"16894","type":"light","sortId":39,"address":"22 15 F3 6"},{"name":"Mudroom Bathroom","parent":"16894","type":"light","sortId":40,"address":"25 4F 57 1"},{"name":"Back Bed and Bath","address":"8598","sortId":41,"type":"folder"},{"name":"Bathroom","parent":"8598","type":"light","sortId":42,"address":"20 93 AA 1"},{"name":"Baby Room","parent":"8598","type":"light","sortId":43,"address":"20 A8 14 1"},{"name":"Office","parent":"8598","type":"light","sortId":44,"address":"20 AF 5F 1"},{"name":"Baby Light On","parent":"8598","type":"light","sortId":45,"address":"26 88 8D 1"},{"name":"Baby Light Read","parent":"8598","type":"light","sortId":46,"address":"26 88 8D 2"},{"name":"Baby Light Bedtime","parent":"8598","type":"light","sortId":47,"address":"26 88 8D 3"},{"name":"Baby Light Very Dim","parent":"8598","type":"light","sortId":48,"address":"26 88 8D 4"},{"name":"Entry and Hall","address":"9555","sortId":49,"type":"folder"},{"name":"Front Porch Sconces","parent":"9555","type":"light","sortId":50,"address":"20 97 43 1"},{"name":"Foyer 3way","parent":"9555","type":"light","sortId":51,"address":"20 9B DC 1"},{"name":"Stairs 3way","parent":"9555","type":"light","sortId":52,"address":"20 A7 D2 1"},{"name":"Front Porch Light","parent":"9555","type":"light","sortId":53,"address":"20 A9 79 1"},{"name":"Front Porch Sconces 3way","parent":"9555","type":"light","sortId":54,"address":"20 AA 29 1"},{"name":"Hallway 3way","parent":"9555","type":"light","sortId":55,"address":"20 AC BF 1"},{"name":"Stairs","parent":"9555","type":"light","sortId":56,"address":"20 AD FC 1"},{"name":"Hallway","parent":"9555","type":"light","sortId":57,"address":"20 AE BA 1"},{"name":"Foyer","parent":"9555","type":"light","sortId":58,"address":"22 13 AA 1"},{"name":"Hall Arm","parent":"9555","type":"light","sortId":59,"address":"22 13 AA 3"},{"name":"22.13.AA.B","parent":"9555","type":"light","sortId":60,"address":"22 13 AA 4"},{"name":"22.13.AA.C","parent":"9555","type":"light","sortId":61,"address":"22 13 AA 5"},{"name":"Hallway - All Off","parent":"9555","type":"light","sortId":62,"address":"22 13 AA 6"},{"name":"Master Bathroom","address":"26068","sortId":63,"type":"folder"},{"name":"Master Bath Vanity","parent":"26068","type":"light","sortId":64,"address":"20 9F FD 1"},{"name":"Master Thrown","parent":"26068","type":"light","sortId":65,"address":"20 A8 7 1"},{"name":"Master Shower_Tub","parent":"26068","type":"light","sortId":66,"address":"20 AA 26 1"},{"name":"Great Room","address":"50610","sortId":67,"type":"folder"},{"name":"Great Room 3way","parent":"50610","type":"light","sortId":68,"address":"20 A0 62 1"},{"name":"Great Room Main","parent":"50610","type":"light","sortId":69,"address":"20 A5 AC 1"},{"name":"Garage","address":"30041","sortId":70,"type":"folder"},{"name":"3rd Car 3way","parent":"30041","type":"light","sortId":71,"address":"20 A8 F2 1"},{"name":"Garage 3way","parent":"30041","type":"light","sortId":72,"address":"20 B1 1D 1"},{"name":"Garage","parent":"30041","type":"light","sortId":73,"address":"22 15 F3 1"},{"name":"3rd Car Garage","parent":"30041","type":"light","sortId":74,"address":"25 40 22 1"},{"name":"Bonus Room","address":"52404","sortId":75,"type":"folder"},{"name":"Bonus Bathroom","parent":"52404","type":"light","sortId":76,"address":"20 B2 5E 1"},{"name":"Bonus Top Stairs","parent":"52404","type":"light","sortId":77,"address":"25 36 DB 1"},{"name":"Bonus Room","parent":"52404","type":"light","sortId":78,"address":"25 3B F2 1"},{"name":"Top Stairs 3way","parent":"52404","type":"light","sortId":79,"address":"25 47 9F 1"},{"name":"Basement-Dusk.Dawn","parent":"21 58 C8 1","type":"light","sortId":80,"address":"21 58 C8 2"},{"name":"Basement-Low Bat","parent":"21 58 C8 1","type":"light","sortId":81,"address":"21 58 C8 3"}];
//    return newArray;
    return getFoldersAndNodes().then(function(data){
        var deferred = Q.defer();
        var xml = Ti.XML.parseString(data);
        var nodesJSON = convertNodesListToJSON(xml);
        var foldersJSON = convertFoldersJSON(xml.documentElement.getElementsByTagName('folder'));

        var foldersAndNodes = {
            nodes: nodesJSON,
            folders: foldersJSON
        };

        var newArray = [];
        var i = 0;
        //This will flatten the objects and give us a nice flat array
        _.each(foldersAndNodes.nodes, function(node, key){
            //get the name of the folder and add it
            var obj = _.findWhere(foldersAndNodes.folders,{address:key});

            //IF there was a folder then add it.  If not skip this and just add the nodes.
            if (obj) {
                //add the sortId and then increment it
                obj.sortId = i;
                i++;
                newArray.push(obj);
            }

            //add each of the nodes
            _.each(node, function(item){
                item.sortId = i;
                item.address = item.id;
                delete item.id;
                i++;
                newArray.push(item);
            });
        });


        deferred.resolve(newArray);
        return deferred.promise;
    });

}

//ISY hardware Calls

var getFoldersAndNodes = function() {
    Ti.API.info("baseURL: " + baseURL);
    connection.url = baseURL + 'nodes/';
    return xhr.loadUrl(connection);
};

var deviceOff = function(address) {
    var encodedAddress = Ti.Network.encodeURIComponent(address);
    connection.url = baseURL + 'nodes/' + encodedAddress + '/cmd/DOF/';
    return xhr.loadUrl(connection);
};

var deviceOn = function(address,level) {
    Ti.API.info('Fire Address: ' + address);
    var encodedAddress = Ti.Network.encodeURIComponent(address);
    connection.url = baseURL + 'nodes/' + encodedAddress + '/cmd/DON/' + level;
    return xhr.loadUrl(connection);
};

var deviceFastOn = function(address, level) {
    var encodedAddress = Ti.Network.encodeURIComponent(address);
    connection.url = baseURL + 'nodes/' + encodedAddress + '/cmd/DFON/' + level;
    return xhr.loadUrl(connection);
};

var deviceFastOff = function(address) {
    var encodedAddress = Ti.Network.encodeURIComponent(address);
    connection.url = baseURL + 'nodes/' + encodedAddress + '/cmd/DFOF/';
    return xhr.loadUrl(connection);
};

var deviceGetStatus = function(address) {
    var encodedAddress = Ti.Network.encodeURIComponent(address);
    connection.url = baseURL + 'status/' + encodedAddress;

    return xhr.loadUrl(connection);
};

var devicesGetStatus = function() {
    connection.url = baseURL + 'status';
    return xhr.loadUrl(connection);
};

//*************************************HELPER METHODS*************************************
var processDeviceStatusXML = function(xmlData) {
    var doc = Ti.XML.parseString(xmlData);
    var elements = doc.getElementsByTagName('property');
    var property = elements.item(0);
    var status = property.getAttribute('formatted');

    return status;
};

function convertNodesStatusToJson(xml) {
    var nodesJSON = [];
    for (var i = 0; i < xml.length; i++) {
        var address = xml.item(i).getAttribute('id');
        var level = xml.item(i).getElementsByTagName('property').item(0).getAttribute('value');

        nodesJSON.push({
            id: address,
            level: level
        });
    }

//    return _.groupBy(nodesJSON,'parent');
    return nodesJSON;
}

function convertNodesListToJSON(xml) {
    var nodesJSON = [];

    //Add Nodes
    parseXMLNodes(xml.documentElement.getElementsByTagName('node'), "light");

    //Add Scenes
    parseXMLNodes(xml.documentElement.getElementsByTagName('group'), "scene");


    function parseXMLNodes(xml, type){
        for (var i = 0; i < xml.length; i++) {
            var address = xml.item(i).getElementsByTagName('address').item(0).text;
            var name = xml.item(i).getElementsByTagName('name').item(0).text;
            var parent = '111'; //This is hardcoded as the MISC folder.
            if (xml.item(i).getElementsByTagName('parent').item(0) != null) {
                parent = xml.item(i).getElementsByTagName('parent').item(0).text;
            }
            nodesJSON.push({
                id: address,
                name: name,
                parent: parent,
                type: type
            });
        }
    }

    return _.groupBy(nodesJSON,'parent');
}

function convertFoldersJSON(xml) {
    var foldersJSON = [];

    for (var i = 0; i < xml.length; i++) {
        var name = xml.item(i).getElementsByTagName('name').item(0).text;
        var address = xml.item(i).getElementsByTagName('address').item(0).text;
        foldersJSON.push({
            name: name,
            address: address,
            type: "folder"
        });
    }
    return foldersJSON;
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

