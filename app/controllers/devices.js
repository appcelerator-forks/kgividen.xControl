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

//filter only models that are supposed to be in the view.
//Alloy.Collections.device.whereShowInView("showInLightingView",["light","folder"]);
var args = arguments[0] || {};
Ti.API.info("args:" + JSON.stringify(args.viewName));
Alloy.Collections.device.whereShowInView(args.viewName);

//Set this to a global so it can be used in the lightRow after a toggle or setLevel
Alloy.Globals.updateStatus = updateStatus;
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


