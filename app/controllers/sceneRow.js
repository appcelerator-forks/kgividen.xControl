if ($model) {
    $.sceneRow.model = $model.toJSON();
    var rowGroupStyle = $.createStyle({
        classes: 'groupRow'
    });
    if (osname == "ios") {
        if ($model.get('type') == "folder") {
            $.btnOn.hide();
            $.btnOff.hide();
            $.sceneRow.applyProperties(rowGroupStyle);
        } else {
            $.group.hide();
        }
    } else {
        // OLD WAY.  with 3.3 hide() works correctly.
        var hideStyle = $.createStyle({
            classes: 'hide'
        });
        if ($model.get('type') == "folder") {
            $.btnOn.applyProperties(hideStyle);
            $.btnOff.applyProperties(hideStyle);
            $.sceneRow.applyProperties(rowGroupStyle);
        } else {
            $.group.applyProperties(hideStyle);
        }
    }
}

$.btnOn.addEventListener('click', function(e) {
    //We have to add a delay here cause the ISY will respond with a doc even though the scene isn't at the right level and so we'd be off...
    Ti.API.info("e: " + JSON.stringify(e));
    device.sceneOn(e.source.address);
});
$.btnOff.addEventListener('click', function(e) {
    //We have to add a delay here cause the ISY will respond with a doc even though the scene isn't at the right level and so we'd be off...
    device.sceneOff(e.source.address);
});