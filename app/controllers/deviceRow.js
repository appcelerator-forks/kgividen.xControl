if ($model) {
    $.deviceRow.model = $model.toJSON();
    var rowGroupStyle = $.createStyle({
        classes: 'groupRow'
    });
    if (osname == "ios") {
        if ($model.get('type') == "folder") {
            $.lightContainer.hide();
            $.sceneContainer.hide();
            $.deviceRow.applyProperties(rowGroupStyle);
        } else if ($model.get('type') == "scene") {
            $.lightContainer.hide();
            $.group.hide();
        } else if ($model.get('type') == "light") {
            $.sceneContainer.hide();
            $.group.hide();
        }
    } else {
        //TODO Do we need this for android with 3.3?
        // OLD WAY.  with 3.3 hide() works correctly.
        var hideStyle = $.createStyle({
            classes: 'hide'
        });
        if ($model.get('type') == "folder") {
            $.btn.applyProperties(hideStyle);
            $.slider.applyProperties(hideStyle);
            $.sliderLbl.applyProperties(hideStyle);
            $.deviceRow.applyProperties(rowGroupStyle);
        } else {
            $.group.applyProperties(hideStyle);
        }
    }
}

$.btn.addEventListener('click', function(e) {
    //We have to add a delay here cause the ISY will respond with a doc even though the light isn't at the right level and so we'd be off...
    device.toggle(e.source.address).then(Alloy.Globals.updateStatus);
});

$.slider.addEventListener('touchend', function(e) {
    var level = Math.round(e.source.value);
    device.setLevel(e.source.address, level).then(Alloy.Globals.updateStatus);
    $.sliderLbl.text = level;
});

$.sceneBtnOn.addEventListener('click', function(e) {
    //We have to add a delay here cause the ISY will respond with a doc even though the scene isn't at the right level and so we'd be off...
    Ti.API.info("e: " + JSON.stringify(e));
    device.sceneOn(e.source.address);
});
$.sceneBtnOff.addEventListener('click', function(e) {
    //We have to add a delay here cause the ISY will respond with a doc even though the scene isn't at the right level and so we'd be off...
    device.sceneOff(e.source.address);
});