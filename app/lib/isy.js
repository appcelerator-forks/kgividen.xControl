var reste = require("reste");
var api = new reste();

var REFRESH_DELAY = 800;  // This is used because if we set the level and then immediately get the status the ISY returns the old status.

var deviceTypes = require('deviceTypes').types;
var connection = {};
//TODO INIT connection so it loads it for ever instance.
exports.init = function() {
    //This is the saved connection object set by the user
    var conn = Ti.App.Properties.getObject('conn_current');
    if (!conn) {
        return false;
    } else {
        connection.baseURL = conn.method + '://' + conn.server + ':' + conn.port + '/rest/';
        var authString = conn.username + ':' + conn.password;
        var b64encodedAuthString = Ti.Utils.base64encode(authString.toString());
        //This is the connection we'll send to xhr
        connection.headers = {
        	'Accept':'application/xml', 
        	'Authorization':'Basic ' + b64encodedAuthString
        };
        connection.connectiontype = 'GET';
        connection.username = conn.username; //This is so we can throw an error and let them know what the user was.

	    api.config({
		    debug: true, // allows logging to console of ::REST:: messages
		    autoValidateParams: false, // set to true to throw errors if <param> url properties are not passed
		    timeout: 10000,
		    url: connection.baseURL,
		    requestHeaders: connection.headers,
		    methods: [{
		        name: "getDeviceStatus",
		        get: "status/<address>",
		        onError: function(e, callback){
		            Ti.API.info("There was an error getting the status!");
		        }
		    },{
		        name: "getNodes",
		        get: "nodes",
		        onError: function(e, callback){
		            Ti.API.info("There was an error getting the nodes!");
		        }
		    },{
		        name: "deviceFastOn",
		        get: "nodes/<address>/cmd/DFON",
		        onError: function(e, callback){
		            Ti.API.info("There was an error setting device fast on!");
		        }
		    },{
		        name: "deviceFastOff",
		        get: "nodes/<address>/cmd/DFOF",
		        onError: function(e, callback){
		            Ti.API.info("There was an error setting device fast off!");
		        }
		    },{
		        name: "deviceOn",
		        get: "nodes/<address>/cmd/DON/<level>",
		        onError: function(e, callback){
		            Ti.API.info("There was an error setting device on!");
		       }
		    },{
		        name: "deviceOff",
		        get: "nodes/<address>/cmd/DOF",
		        onError: function(e, callback){
		            Ti.API.info("There was an error setting device off!");
		       }
		    },{
		        name: "runProgram",
		        get: "programs/<id>/run/<runType>",
		        onError: function(e, callback){
		            Ti.API.info("There was an error running program");
		       }
		    },{
		        name: "enableProgram",
		        get: "programs/<id>/enable",
		        onError: function(e, callback){
		            Ti.API.info("There was an error enabling program");
		       }
	        },{
		        name: "disableProgram",
		        get: "programs/<id>/disable",
		        onError: function(e, callback){
		            Ti.API.info("There was an error disabling program");
		       }
	        }
		    ],
		    onError: function(e) {
		        Ti.API.info("There was an error accessing the API");
		    },
		    onLoad: function(e, callback) {
		        callback(e);
		    }
		});
		
    	return true;
    }
};

exports.getConnection = function () {
	if(connection){
		return connection;		
	} 
	
	return;
};

// "INTERFACE" calls.  These are calls that all hardware devices will have.
exports.setLevel = function (address, l, callback){
	var encodedAddress = Ti.Network.encodeURIComponent(address);
    var level = Math.round(l / 100 * 255);
    if (level == 0) {
        api.deviceOff({address: encodedAddress}, function(data){
        	callback && setTimeout(callback, REFRESH_DELAY);
        });
    } else {
        api.deviceOn({address: encodedAddress, level:level}, function(data){
        	callback && setTimeout(callback, REFRESH_DELAY);
        });
    }
};

exports.toggle = function (address, callback){
    var encodedAddress = Ti.Network.encodeURIComponent(address);
	api.getDeviceStatus({address: encodedAddress}, function(data){
	    var deviceStatus = processDeviceStatusXML(data);
	    if (deviceStatus == 'Off' || deviceStatus == "0%" || deviceStatus == "0" || deviceStatus == "unlocked") {
	        api.deviceFastOn({address: encodedAddress}, function(data){
		    	//we have to add a slight delay otherwise the ISY returns the status of what it was before the fastOn fastOff executed even in the callback.
				callback && setTimeout(callback, REFRESH_DELAY);
	        });
	    } else {
	        api.deviceFastOff({address: encodedAddress}, function(data){
				//we have to add a slight delay otherwise the ISY returns the status of what it was before the fastOn fastOff executed even in the callback.
        		callback && setTimeout(callback, REFRESH_DELAY);	
	        });
	    }
	   
	});
};

exports.runProgram = function(id, runType, callback){
	var encodedId = Ti.Network.encodeURIComponent(id);
	api.runProgram({id:encodedId,runType:runType}, function(data){
		callback && callback();	
	});
};

exports.enableProgram = function(id, callback){
	var encodedId = Ti.Network.encodeURIComponent(id);
	api.enableProgram({id:encodedId}, function(data){
		callback && callback();	
	});
};

exports.disableProgram = function(id, callback){
	var encodedId = Ti.Network.encodeURIComponent(id);
	api.disableProgram({id:encodedId}, function(data){
		callback && callback();	
	});
};

exports.sceneOn = function(address, callback){
	var encodedAddress = Ti.Network.encodeURIComponent(address);
    var level = 255;
    api.deviceOn({address: encodedAddress, level:level}, function(data){
    	callback && callback();
    });
    
};

exports.sceneOff = function(address, callback){
	var encodedAddress = Ti.Network.encodeURIComponent(address);
    api.deviceOff({address: encodedAddress}, function(data){
    	callback && callback();
    });
};

//This should return something like this.  Basically it's a list of folders and then the objects in those folders.
//[{"name":"Back Bed and Bath","id":"8598"},{"id":"20 93 AA 1","name":"Bathroom","parent":"8598","type":"light"},{"id":"20 A8 14 1","name":"Baby Room","parent":"8598","type":"light"},{"id":"20 AF 5F 1","name":"Office","parent":"8598","type":"light"},{"id":"26 88 8D 1","name":"Baby Light On","parent":"8598","type":"light"},{"id":"26 88 8D 2","name":"Baby Light Read","parent":"8598","type":"light"},{"id":"26 88 8D 3","name":"Baby Light Bedtime","parent":"8598","type":"light"},{"id":"26 88 8D 4","name":"Baby Light Very Dim","parent":"8598","type":"light"}]
exports.getListOfDevices = function(callback) {
//    var newArray = [{"name":"Kitchen","address":"29763","SortId":0,"type":"folder"},{"name":"Backyard Floods","parent":"29763","type":"light","SortId":1,"address":"20 88 48 1"},{"name":"Kitchen 3way","parent":"29763","type":"light","SortId":2,"address":"20 91 DD 1"},{"name":"Kitchen Sink","parent":"29763","type":"light","SortId":3,"address":"20 95 1D 1"},{"name":"Patio","parent":"29763","type":"light","SortId":4,"address":"20 A8 FC 1"},{"name":"Dining Area","parent":"29763","type":"light","SortId":5,"address":"20 AE 83 1"},{"name":"Kitchen Under Cabinets","parent":"29763","type":"light","SortId":6,"address":"20 B1 50 1"},{"name":"Kitchen","parent":"29763","type":"light","SortId":7,"address":"20 B2 AF 1"},{"name":"Kitchen Butlers Pantry","parent":"29763","type":"light","SortId":8,"address":"20 B2 B 1"},{"name":"Basement","address":"24703","SortId":9,"type":"folder"},{"name":"Basement Hall 4way","parent":"24703","type":"light","SortId":10,"address":"20 91 CF 1"},{"name":"Basement Stairs 3way","parent":"24703","type":"light","SortId":11,"address":"20 91 D4 1"},{"name":"Basement Hall","parent":"24703","type":"light","SortId":12,"address":"20 91 E1 1"},{"name":"Basement Stairs","parent":"24703","type":"light","SortId":13,"address":"20 98 62 1"},{"name":"Basement Great Room","parent":"24703","type":"light","SortId":14,"address":"20 A7 62 1"},{"name":"Basement Hall 4way","parent":"24703","type":"light","SortId":15,"address":"20 B1 CF 1"},{"name":"Basement Door-Opened","parent":"24703","type":"light","SortId":16,"address":"21 41 DF 1"},{"name":"Basement Door-Closed","parent":"24703","type":"light","SortId":17,"address":"21 41 DF 2"},{"name":"Basement-Sensor","parent":"24703","type":"light","SortId":18,"address":"21 58 C8 1"},{"name":"Master Bedroom","address":"52046","SortId":19,"type":"folder"},{"name":"Master Main Light","parent":"52046","type":"light","SortId":20,"address":"20 91 D2 1"},{"name":"Master Closet","parent":"52046","type":"light","SortId":21,"address":"20 92 B 1"},{"name":"Master Bay Window","parent":"52046","type":"light","SortId":22,"address":"20 AD EA 1"},{"name":"Kent's Reading Light","parent":"52046","type":"light","SortId":23,"address":"22 14 CE 1"},{"name":"Kent Arm","parent":"52046","type":"light","SortId":24,"address":"22 14 CE 3"},{"name":"22.14.CE.B","parent":"52046","type":"light","SortId":25,"address":"22 14 CE 4"},{"name":"22.14.CE.C","parent":"52046","type":"light","SortId":26,"address":"22 14 CE 5"},{"name":"Kent's All Off","parent":"52046","type":"light","SortId":27,"address":"22 14 CE 6"},{"name":"Rhonda's Reading Light","parent":"52046","type":"light","SortId":28,"address":"22 17 46 1"},{"name":"Rhonda Arm","parent":"52046","type":"light","SortId":29,"address":"22 17 46 3"},{"name":"22.17.46.B","parent":"52046","type":"light","SortId":30,"address":"22 17 46 4"},{"name":"22.17.46.C","parent":"52046","type":"light","SortId":31,"address":"22 17 46 5"},{"name":"Rhonda's All Off","parent":"52046","type":"light","SortId":32,"address":"22 17 46 6"},{"name":"Mudroom","address":"16894","SortId":33,"type":"folder"},{"name":"Mudroom","parent":"16894","type":"light","SortId":34,"address":"20 91 E3 1"},{"name":"Mudroom 3way","parent":"16894","type":"light","SortId":35,"address":"20 A5 34 1"},{"name":"Mudroom Arm","parent":"16894","type":"light","SortId":36,"address":"22 15 F3 3"},{"name":"22.15.F3.B","parent":"16894","type":"light","SortId":37,"address":"22 15 F3 4"},{"name":"22.15.F3.C","parent":"16894","type":"light","SortId":38,"address":"22 15 F3 5"},{"name":"Mudroom All Off","parent":"16894","type":"light","SortId":39,"address":"22 15 F3 6"},{"name":"Mudroom Bathroom","parent":"16894","type":"light","SortId":40,"address":"25 4F 57 1"},{"name":"Back Bed and Bath","address":"8598","SortId":41,"type":"folder"},{"name":"Bathroom","parent":"8598","type":"light","SortId":42,"address":"20 93 AA 1"},{"name":"Baby Room","parent":"8598","type":"light","SortId":43,"address":"20 A8 14 1"},{"name":"Office","parent":"8598","type":"light","SortId":44,"address":"20 AF 5F 1"},{"name":"Baby Light On","parent":"8598","type":"light","SortId":45,"address":"26 88 8D 1"},{"name":"Baby Light Read","parent":"8598","type":"light","SortId":46,"address":"26 88 8D 2"},{"name":"Baby Light Bedtime","parent":"8598","type":"light","SortId":47,"address":"26 88 8D 3"},{"name":"Baby Light Very Dim","parent":"8598","type":"light","SortId":48,"address":"26 88 8D 4"},{"name":"Entry and Hall","address":"9555","SortId":49,"type":"folder"},{"name":"Front Porch Sconces","parent":"9555","type":"light","SortId":50,"address":"20 97 43 1"},{"name":"Foyer 3way","parent":"9555","type":"light","SortId":51,"address":"20 9B DC 1"},{"name":"Stairs 3way","parent":"9555","type":"light","SortId":52,"address":"20 A7 D2 1"},{"name":"Front Porch Light","parent":"9555","type":"light","SortId":53,"address":"20 A9 79 1"},{"name":"Front Porch Sconces 3way","parent":"9555","type":"light","SortId":54,"address":"20 AA 29 1"},{"name":"Hallway 3way","parent":"9555","type":"light","SortId":55,"address":"20 AC BF 1"},{"name":"Stairs","parent":"9555","type":"light","SortId":56,"address":"20 AD FC 1"},{"name":"Hallway","parent":"9555","type":"light","SortId":57,"address":"20 AE BA 1"},{"name":"Foyer","parent":"9555","type":"light","SortId":58,"address":"22 13 AA 1"},{"name":"Hall Arm","parent":"9555","type":"light","SortId":59,"address":"22 13 AA 3"},{"name":"22.13.AA.B","parent":"9555","type":"light","SortId":60,"address":"22 13 AA 4"},{"name":"22.13.AA.C","parent":"9555","type":"light","SortId":61,"address":"22 13 AA 5"},{"name":"Hallway - All Off","parent":"9555","type":"light","SortId":62,"address":"22 13 AA 6"},{"name":"Master Bathroom","address":"26068","SortId":63,"type":"folder"},{"name":"Master Bath Vanity","parent":"26068","type":"light","SortId":64,"address":"20 9F FD 1"},{"name":"Master Thrown","parent":"26068","type":"light","SortId":65,"address":"20 A8 7 1"},{"name":"Master Shower_Tub","parent":"26068","type":"light","SortId":66,"address":"20 AA 26 1"},{"name":"Great Room","address":"50610","SortId":67,"type":"folder"},{"name":"Great Room 3way","parent":"50610","type":"light","SortId":68,"address":"20 A0 62 1"},{"name":"Great Room Main","parent":"50610","type":"light","SortId":69,"address":"20 A5 AC 1"},{"name":"Garage","address":"30041","SortId":70,"type":"folder"},{"name":"3rd Car 3way","parent":"30041","type":"light","SortId":71,"address":"20 A8 F2 1"},{"name":"Garage 3way","parent":"30041","type":"light","SortId":72,"address":"20 B1 1D 1"},{"name":"Garage","parent":"30041","type":"light","SortId":73,"address":"22 15 F3 1"},{"name":"3rd Car Garage","parent":"30041","type":"light","SortId":74,"address":"25 40 22 1"},{"name":"Bonus Room","address":"52404","SortId":75,"type":"folder"},{"name":"Bonus Bathroom","parent":"52404","type":"light","SortId":76,"address":"20 B2 5E 1"},{"name":"Bonus Top Stairs","parent":"52404","type":"light","SortId":77,"address":"25 36 DB 1"},{"name":"Bonus Room","parent":"52404","type":"light","SortId":78,"address":"25 3B F2 1"},{"name":"Top Stairs 3way","parent":"52404","type":"light","SortId":79,"address":"25 47 9F 1"},{"name":"Basement-Dusk.Dawn","parent":"21 58 C8 1","type":"light","SortId":80,"address":"21 58 C8 2"},{"name":"Basement-Low Bat","parent":"21 58 C8 1","type":"light","SortId":81,"address":"21 58 C8 3"}];
//    return newArray;

   //We are using this instead of the restapi model function because it comes in XML and the XMLTools isn't parsing it correctly.   	
   api.getNodes(function(data) {
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
                //add the SortId and then increment it
                obj.SortId = i;
                i++;
                newArray.push(obj);
            }

            //add each of the nodes
            _.each(node, function(item){
                item.SortId = i;
                item.address = item.id;
                delete item.id;
                i++;
                newArray.push(item);
            });
        });
    	callback && callback(newArray);
		
	});
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
        var formatted = xml.item(i).getElementsByTagName('property').item(0).getAttribute('formatted');

        nodesJSON.push({
            id: address,
            level: level,
            formatted:formatted 
        });
    }

//    return _.groupBy(nodesJSON,'parent');
    return nodesJSON;
}

function convertNodesListToJSON(xml) {
    var nodesJSON = [];

    //Add Nodes
    parseXMLNodes(xml.documentElement.getElementsByTagName('node'), "node");

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
            
            //if it is nodes then let's find out what kind of node it is.  Scenes don't have a type and are all the same.
            if(type == "node") {
            	//Get the first character of the type in the XML sunce that's what determines if it's a dimmer, switch or whatever.
	            var currentNodeType = xml.item(i).getElementsByTagName('type').item(0).text;
	            var nodeType = currentNodeType.substr(0, currentNodeType.indexOf('.'));
	            
		        //If type is supported then set it to the type from the deviceTypes
		        if (deviceTypes[nodeType].supported) {
		        	deviceType = deviceTypes[nodeType].type;
		        } else {
		        	continue; //skip it if it's not supported	
		        }	
           } else if(type == "scene") {
           		deviceType = "scene";
           }
           
            nodesJSON.push({
                id: address,
                name: name,
                parent: parent,
                type: deviceType
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
