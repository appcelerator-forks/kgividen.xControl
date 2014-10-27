function updateStatus(){
    return device.getAllDevicesStatus().then(updateLightsStatus);
}
function updateLightsStatus(nodesByAddressAndStatus){
    var lightTVData = $.deviceTableView.getData()[0].getRows();
    _.each(lightTVData, function(row){
        if(row.model.type == 'light') {
            var btn = row.getChildren()[0].getChildren()[0];
            var current = _.findWhere(nodesByAddressAndStatus, {address:btn.address});

            if(current.level > 0){
                $.removeClass(btn, 'btnOff');
                $.addClass(btn, 'btnOn');
                $.addClass(btn, 'btn');
            } else {
                $.addClass(btn, 'btnOff');
                $.addClass(btn, 'btn');
            }

            var sliderContainer = row.getChildren()[0].getChildren()[1];

            //slider
            sliderContainer.getChildren()[0].value = current.level;
            //sliderLbl
            sliderContainer.getChildren()[1].text = current.level;
        }
    });
}

//filter only models that are supposed to be in the view.
var args = arguments[0] || {};
//TODO
//Alloy.Collections.device.whereShowInView(args.viewName, args.sortBy);
Alloy.Collections.device.whereShowInView(args.viewId);

//Set this to a global so it can be used in the lightRow after a toggle or setLevel
Alloy.Globals.updateStatus = updateStatus;
updateStatus();

//LISTENERS
$.deviceContainerView.addEventListener("close", function(){
    $.destroy();
    Ti.API.info("DESTROY TABLEVIEW!!!");
    for (var i = tableView.data[0].rows.length-1; i >= 0; i--) {
        $.deviceTableView.deleteRow(i);
    }
    $.deviceTableView.setData([]);
});

if(osname == "android"){
    $.refreshControlBtn.addEventListener('click', function () {
        return device.getAllDevicesStatus()
            .then(updateLightsStatus);
    });
}

if(osname=="ios") {
    $.refreshControl.addEventListener('refreshstart', function () {
        return device.getAllDevicesStatus()
            .then(updateLightsStatus)
            .then(function () {
                    $.refreshControl.endRefreshing();
            });
    });
}
//Buttons
$.deviceTableView.addEventListener('click', function(e) {
    if(e.source.address && e.source.id == "btn"){
        device.toggle(e.source.address).then(Alloy.Globals.updateStatus);
    }
    if(e.source.address && e.source.id == "sceneBtnOn"){
        device.sceneOn(e.source.address);
    }
    if(e.source.address && e.source.id == "sceneBtnOff"){
        device.sceneOff(e.source.address);
    }
});

$.deviceTableView.addEventListener('touchend', function(e) {
    if(e.source.id == "slider") {
        var level = Math.round(e.source.value);
        device.setLevel(e.source.address, level).then(Alloy.Globals.updateStatus);
        e.row.getChildren()[0].getChildren()[1].getChildren()[1].text = level;  //Slider label
    }
});
