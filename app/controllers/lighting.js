function updateStatus(){
    return device.getAllDevicesStatus().then(updateLightsStatus);
}
function updateLightsStatus(nodesByAddressAndStatus){
//    Ti.API.info("nodesbuaddressand status: " + JSON.stringify(nodesByAddressAndStatus));
    var lightTVData = $.lightTableView.getData()[0].getRows();
    _.each(lightTVData, function(row){
        if(row.model.type == 'light') {
            var btn = row.getChildren()[0];
            var sliderContainer = row.getChildren()[1].getChildren();
            var current = _.findWhere(nodesByAddressAndStatus, {address:btn.address});
//            Ti.API.info("btn: " + JSON.stringify(btn.title) + " current: " + JSON.stringify(current));

            if(current.level > 0){
//                Ti.API.info("level > 0 remove class!!!!!!");
                $.removeClass(btn, 'btnOff');
                $.addClass(btn, 'btnOn');
            } else {
//                Ti.API.info("level < 0 add class btnOff!!!!!!");

                $.addClass(btn, 'btnOff');
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