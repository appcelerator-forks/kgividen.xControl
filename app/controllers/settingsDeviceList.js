
//LISTENERS

$.devicesTableView.addEventListener('move', function(e){
//    Ti.API.info("tv e index: " + JSON.stringify(e.index));

//    var devices = Alloy.Collections.device;

//    var deviceTvData = $.devicesTableView.data[0].rows;
//        Ti.API.info("deviceTvData BEFORE: " + JSON.stringify(deviceTvData));

//    Ti.API.info("deviceTvData AFTER: " + JSON.stringify(deviceTvData));

//    devices.updatePositions();
//    devices.sort();
//    devices.trigger('sync');
});

$.refreshDevicesBtn.addEventListener('click', function () {
    device.getListOfDevices().then(function (data) {
        //var data = [{"name":"Kitchen","address":"29763","sortId":0,"type":"folder","displayName":"Kitchen","parent":"unknown"},{"name":"Backyard Floods","parent":"29763","type":"light","sortId":1,"address":"20 88 48 1","displayName":"Backyard Floods"},{"name":"Kitchen 3way","parent":"29763","type":"light","sortId":2,"address":"20 91 DD 1","displayName":"Kitchen 3way"},{"name":"Kitchen Sink","parent":"29763","type":"light","sortId":3,"address":"20 95 1D 1","displayName":"Kitchen Sink"},{"name":"Patio","parent":"29763","type":"light","sortId":4,"address":"20 A8 FC 1","displayName":"Patio"},{"name":"Dining Area","parent":"29763","type":"light","sortId":5,"address":"20 AE 83 1","displayName":"Dining Area"},{"name":"Kitchen Under Cabinets","parent":"29763","type":"light","sortId":6,"address":"20 B1 50 1","displayName":"Kitchen Under Cabinets"},{"name":"Kitchen","parent":"29763","type":"light","sortId":7,"address":"20 B2 AF 1","displayName":"Kitchen"},{"name":"Kitchen Butlers Pantry","parent":"29763","type":"light","sortId":8,"address":"20 B2 B 1","displayName":"Kitchen Butlers Pantry"},{"name":"Basement","address":"24703","sortId":9,"type":"folder","displayName":"Basement","parent":"unknown"},{"name":"Basement Hall 4way","parent":"24703","type":"light","sortId":10,"address":"20 91 CF 1","displayName":"Basement Hall 4way"},{"name":"Basement Stairs 3way","parent":"24703","type":"light","sortId":11,"address":"20 91 D4 1","displayName":"Basement Stairs 3way"},{"name":"Basement Hall","parent":"24703","type":"light","sortId":12,"address":"20 91 E1 1","displayName":"Basement Hall"},{"name":"Basement Stairs","parent":"24703","type":"light","sortId":13,"address":"20 98 62 1","displayName":"Basement Stairs"},{"name":"Basement Great Room","parent":"24703","type":"light","sortId":14,"address":"20 A7 62 1","displayName":"Basement Great Room"},{"name":"Basement Hall 4way","parent":"24703","type":"light","sortId":15,"address":"20 B1 CF 1","displayName":"Basement Hall 4way"},{"name":"Basement Door-Opened","parent":"24703","type":"light","sortId":16,"address":"21 41 DF 1","displayName":"Basement Door-Opened"},{"name":"Basement Door-Closed","parent":"24703","type":"light","sortId":17,"address":"21 41 DF 2","displayName":"Basement Door-Closed"},{"name":"Basement-Sensor","parent":"24703","type":"light","sortId":18,"address":"21 58 C8 1","displayName":"Basement-Sensor"},{"name":"Master Bedroom","address":"52046","sortId":19,"type":"folder","displayName":"Master Bedroom","parent":"unknown"},{"name":"Master Main Light","parent":"52046","type":"light","sortId":20,"address":"20 91 D2 1","displayName":"Master Main Light"},{"name":"Master Closet","parent":"52046","type":"light","sortId":21,"address":"20 92 B 1","displayName":"Master Closet"},{"name":"Master Bay Window","parent":"52046","type":"light","sortId":22,"address":"20 AD EA 1","displayName":"Master Bay Window"},{"name":"Kent's Reading Light","parent":"52046","type":"light","sortId":23,"address":"22 14 CE 1","displayName":"Kent's Reading Light"},{"name":"Kent Arm","parent":"52046","type":"light","sortId":24,"address":"22 14 CE 3","displayName":"Kent Arm"},{"name":"22.14.CE.B","parent":"52046","type":"light","sortId":25,"address":"22 14 CE 4","displayName":"22.14.CE.B"},{"name":"22.14.CE.C","parent":"52046","type":"light","sortId":26,"address":"22 14 CE 5","displayName":"22.14.CE.C"},{"name":"Kent's All Off","parent":"52046","type":"light","sortId":27,"address":"22 14 CE 6","displayName":"Kent's All Off"},{"name":"Rhonda's Reading Light","parent":"52046","type":"light","sortId":28,"address":"22 17 46 1","displayName":"Rhonda's Reading Light"},{"name":"Rhonda Arm","parent":"52046","type":"light","sortId":29,"address":"22 17 46 3","displayName":"Rhonda Arm"},{"name":"22.17.46.B","parent":"52046","type":"light","sortId":30,"address":"22 17 46 4","displayName":"22.17.46.B"},{"name":"22.17.46.C","parent":"52046","type":"light","sortId":31,"address":"22 17 46 5","displayName":"22.17.46.C"},{"name":"Rhonda's All Off","parent":"52046","type":"light","sortId":32,"address":"22 17 46 6","displayName":"Rhonda's All Off"},{"name":"Mudroom","address":"16894","sortId":33,"type":"folder","displayName":"Mudroom","parent":"unknown"},{"name":"Mudroom","parent":"16894","type":"light","sortId":34,"address":"20 91 E3 1","displayName":"Mudroom"},{"name":"Mudroom 3way","parent":"16894","type":"light","sortId":35,"address":"20 A5 34 1","displayName":"Mudroom 3way"},{"name":"Mudroom Arm","parent":"16894","type":"light","sortId":36,"address":"22 15 F3 3","displayName":"Mudroom Arm"},{"name":"22.15.F3.B","parent":"16894","type":"light","sortId":37,"address":"22 15 F3 4","displayName":"22.15.F3.B"},{"name":"22.15.F3.C","parent":"16894","type":"light","sortId":38,"address":"22 15 F3 5","displayName":"22.15.F3.C"},{"name":"Mudroom All Off","parent":"16894","type":"light","sortId":39,"address":"22 15 F3 6","displayName":"Mudroom All Off"},{"name":"Mudroom Bathroom","parent":"16894","type":"light","sortId":40,"address":"25 4F 57 1","displayName":"Mudroom Bathroom"},{"name":"Back Bed and Bath","address":"8598","sortId":41,"type":"folder","displayName":"Back Bed and Bath","parent":"unknown"},{"name":"Bathroom","parent":"8598","type":"light","sortId":42,"address":"20 93 AA 1","displayName":"Bathroom"},{"name":"Baby Room","parent":"8598","type":"light","sortId":43,"address":"20 A8 14 1","displayName":"Baby Room"},{"name":"Office","parent":"8598","type":"light","sortId":44,"address":"20 AF 5F 1","displayName":"Office"},{"name":"Baby Light On","parent":"8598","type":"light","sortId":45,"address":"26 88 8D 1","displayName":"Baby Light On"},{"name":"Baby Light Read","parent":"8598","type":"light","sortId":46,"address":"26 88 8D 2","displayName":"Baby Light Read"},{"name":"Baby Light Bedtime","parent":"8598","type":"light","sortId":47,"address":"26 88 8D 3","displayName":"Baby Light Bedtime"},{"name":"Baby Light Very Dim","parent":"8598","type":"light","sortId":48,"address":"26 88 8D 4","displayName":"Baby Light Very Dim"},{"name":"Entry and Hall","address":"9555","sortId":49,"type":"folder","displayName":"Entry and Hall","parent":"unknown"},{"name":"Front Porch Sconces","parent":"9555","type":"light","sortId":50,"address":"20 97 43 1","displayName":"Front Porch Sconces"},{"name":"Foyer 3way","parent":"9555","type":"light","sortId":51,"address":"20 9B DC 1","displayName":"Foyer 3way"},{"name":"Stairs 3way","parent":"9555","type":"light","sortId":52,"address":"20 A7 D2 1","displayName":"Stairs 3way"},{"name":"Front Porch Light","parent":"9555","type":"light","sortId":53,"address":"20 A9 79 1","displayName":"Front Porch Light"},{"name":"Front Porch Sconces 3way","parent":"9555","type":"light","sortId":54,"address":"20 AA 29 1","displayName":"Front Porch Sconces 3way"},{"name":"Hallway 3way","parent":"9555","type":"light","sortId":55,"address":"20 AC BF 1","displayName":"Hallway 3way"},{"name":"Stairs","parent":"9555","type":"light","sortId":56,"address":"20 AD FC 1","displayName":"Stairs"},{"name":"Hallway","parent":"9555","type":"light","sortId":57,"address":"20 AE BA 1","displayName":"Hallway"},{"name":"Foyer","parent":"9555","type":"light","sortId":58,"address":"22 13 AA 1","displayName":"Foyer"},{"name":"Hall Arm","parent":"9555","type":"light","sortId":59,"address":"22 13 AA 3","displayName":"Hall Arm"},{"name":"22.13.AA.B","parent":"9555","type":"light","sortId":60,"address":"22 13 AA 4","displayName":"22.13.AA.B"},{"name":"22.13.AA.C","parent":"9555","type":"light","sortId":61,"address":"22 13 AA 5","displayName":"22.13.AA.C"},{"name":"Hallway - All Off","parent":"9555","type":"light","sortId":62,"address":"22 13 AA 6","displayName":"Hallway - All Off"},{"name":"Master Bathroom","address":"26068","sortId":63,"type":"folder","displayName":"Master Bathroom","parent":"unknown"},{"name":"Master Bath Vanity","parent":"26068","type":"light","sortId":64,"address":"20 9F FD 1","displayName":"Master Bath Vanity"},{"name":"Master Thrown","parent":"26068","type":"light","sortId":65,"address":"20 A8 7 1","displayName":"Master Thrown"},{"name":"Master Shower_Tub","parent":"26068","type":"light","sortId":66,"address":"20 AA 26 1","displayName":"Master Shower_Tub"},{"name":"Great Room","address":"50610","sortId":67,"type":"folder","displayName":"Great Room","parent":"unknown"},{"name":"Great Room 3way","parent":"50610","type":"light","sortId":68,"address":"20 A0 62 1","displayName":"Great Room 3way"},{"name":"Great Room Main","parent":"50610","type":"light","sortId":69,"address":"20 A5 AC 1","displayName":"Great Room Main"},{"name":"Garage","address":"30041","sortId":70,"type":"folder","displayName":"Garage","parent":"unknown"},{"name":"3rd Car 3way","parent":"30041","type":"light","sortId":71,"address":"20 A8 F2 1","displayName":"3rd Car 3way"},{"name":"Garage 3way","parent":"30041","type":"light","sortId":72,"address":"20 B1 1D 1","displayName":"Garage 3way"},{"name":"Garage","parent":"30041","type":"light","sortId":73,"address":"22 15 F3 1","displayName":"Garage"},{"name":"3rd Car Garage","parent":"30041","type":"light","sortId":74,"address":"25 40 22 1","displayName":"3rd Car Garage"},{"name":"Bonus Room","address":"52404","sortId":75,"type":"folder","displayName":"Bonus Room","parent":"unknown"},{"name":"Bonus Bathroom","parent":"52404","type":"light","sortId":76,"address":"20 B2 5E 1","displayName":"Bonus Bathroom"},{"name":"Bonus Top Stairs","parent":"52404","type":"light","sortId":77,"address":"25 36 DB 1","displayName":"Bonus Top Stairs"},{"name":"Bonus Room","parent":"52404","type":"light","sortId":78,"address":"25 3B F2 1","displayName":"Bonus Room"},{"name":"Top Stairs 3way","parent":"52404","type":"light","sortId":79,"address":"25 47 9F 1","displayName":"Top Stairs 3way"},{"name":"Basement-Dusk.Dawn","parent":"21 58 C8 1","type":"light","sortId":80,"address":"21 58 C8 2","displayName":"Basement-Dusk.Dawn"},{"name":"Basement-Low Bat","parent":"21 58 C8 1","type":"light","sortId":81,"address":"21 58 C8 3","displayName":"Basement-Low Bat"}];

        var devices = Alloy.Collections.device;  //Alloy.Collections.device is defined in alloy.js

        //add all of the defaults if they aren't there for the model
        _.each(data,function(item){
            _.defaults(item,{id:item.address}, {displayName:item.name}, {showInLightingView:1}, {parent:"unkown"}, {type:"unknown"});
        });

        //Add all of the new records in the collection that came from the hardware device.
        _.each(data, function (item) {
            //We only want to add new devices.
            var deviceArray = devices.where({address: item.address});  //get the model from the collection if it's already been added.
            if (!deviceArray[0]) {
                var deviceModel = Alloy.createModel('Device', item);
                deviceModel.save();
            }
        });
        devices.fetch();
    });
});

$.closeBtn.addEventListener('click', function () {
    Ti.API.info("CLOSING!!!!"); //TODO add an indicator here.
    var devices = Alloy.Collections.device;
    var i = 0;
    $.win.close();
    if($.devicesTableView.data[0]) {
        var deviceTvData = $.devicesTableView.data[0].rows;
        //todo: Reordering the devices but there has to be a better way to do this...
        _.each(deviceTvData, function (d) {
            var model = devices.get(d.alloy_id);
            model.save({sortId: i});
            i++;
        });
    }
//    devices.fetch();
});

$.win.addEventListener("close", function(){
    $.destroy();
    Ti.API.info("DESTROYING!!!!");
});

$.win.addEventListener("open", function(){
    Alloy.Collections.device.fetch();
});