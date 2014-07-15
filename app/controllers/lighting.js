function updateStatus(){
    return device.getAllDevicesStatus().then(updateLightsStatus);
}
function updateLightsStatus(nodesByAddressAndStatus){
    var lightTVData = $.lightTableView.getData()[0].getRows();
    _.each(lightTVData, function(row){
        if(row.model.type == 'light') {
            var btn = row.getChildren()[0];
            //todo: This crashes android right now.
            var sliderContainer = row.getChildren()[1].getChildren();
            // Ti.API.info("sliderContainer: " + JSON.stringify(row.getChildren()));

            var current = _.findWhere(nodesByAddressAndStatus, {address:btn.address});

            if(current.level > 0){
                $.removeClass(btn, 'btnOff');
                $.addClass(btn, 'btnOn');
                $.addClass(btn, 'btn');
            } else {
                $.addClass(btn, 'btnOff');
                $.addClass(btn, 'btn');
            }
            //slider
            sliderContainer[0].value = current.level;
            //sliderLbl
            sliderContainer[1].text = current.level;
        }
    });
}

Alloy.Globals.updateStatus = updateStatus;
//filter only models that are supposed to be in the view.
//This is used in the lighting.xml view
function whereShowInLightingView(collection) {
    return collection.where({ showInLightingView: 1 });
}


Alloy.Collections.device.fetch();

updateStatus();

//LISTENERS
$.lightingContainerView.addEventListener("close", function(){
    $.destroy();
});

if(osname == "android"){
    $.refreshControlBtn.addEventListener('click', function () {
        Ti.API.info('refreshstart');
        return device.getAllDevicesStatus()
            .then(updateLightsStatus);
    });
}

if(osname=="ios") {
    $.refreshControl.addEventListener('refreshstart', function () {
        Ti.API.info('refreshstart');
        return device.getAllDevicesStatus()
            .then(updateLightsStatus)
            .then(function () {
                    $.refreshControl.endRefreshing();
            });
    });
}


